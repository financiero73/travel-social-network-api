from typing import List, Optional, Dict
from uuid import UUID
from datetime import datetime, timedelta

from core.travel_user import TravelUser
from core.travel_post import TravelPost
from core.follow import Follow
from core.post_like import PostLike
from core.saved_post import SavedPost
from solar.access import public


@public
def get_social_feed(user_id: UUID, page: int = 0, limit: int = 20) -> List[Dict]:
    """Get Instagram-style social feed for a user based on who they follow."""
    
    # Get users that this user follows
    following_results = Follow.sql(
        "SELECT following_id FROM follows WHERE follower_id = %(user_id)s AND is_active = true",
        {"user_id": user_id}
    )
    
    if not following_results:
        # If not following anyone, show trending/featured posts
        posts_results = TravelPost.sql(
            "SELECT * FROM travel_posts WHERE is_published = true AND (is_featured = true OR created_at > %(recent_date)s) ORDER BY likes_count DESC, created_at DESC LIMIT %(limit)s OFFSET %(offset)s",
            {
                "recent_date": datetime.now() - timedelta(days=7),
                "limit": limit,
                "offset": page * limit
            }
        )
    else:
        # Get posts from followed users
        following_ids = [row["following_id"] for row in following_results]
        following_ids_str = "', '".join([str(uid) for uid in following_ids])
        
        posts_results = TravelPost.sql(
            f"SELECT * FROM travel_posts WHERE user_id IN ('{following_ids_str}') AND is_published = true ORDER BY created_at DESC LIMIT %(limit)s OFFSET %(offset)s",
            {"limit": limit, "offset": page * limit}
        )
    
    # Enrich posts with user data and engagement info
    enriched_posts = []
    for post_data in posts_results:
        # Parse JSON fields if they are strings
        import json
        if isinstance(post_data.get('images'), str):
            # PostgreSQL array format: {item1,item2}
            images_str = post_data['images'].strip('{}')
            post_data['images'] = [img.strip() for img in images_str.split(',') if img.strip()]
        if isinstance(post_data.get('tags'), str):
            # PostgreSQL array format: {item1,item2}
            tags_str = post_data['tags'].strip('{}')
            post_data['tags'] = [tag.strip() for tag in tags_str.split(',') if tag.strip()]
        if isinstance(post_data.get('booking_info'), str):
            # PostgreSQL JSONB format: proper JSON string
            post_data['booking_info'] = json.loads(post_data['booking_info'])
        
        post = TravelPost(**post_data)
        
        # Get post author info
        user_results = TravelUser.sql(
            "SELECT * FROM travel_users WHERE id = %(user_id)s",
            {"user_id": post.user_id}
        )
        user = TravelUser(**user_results[0]) if user_results else None
        
        # Check if current user has liked/saved this post
        like_results = PostLike.sql(
            "SELECT id FROM post_likes WHERE user_id = %(user_id)s AND post_id = %(post_id)s AND is_active = true",
            {"user_id": user_id, "post_id": post.id}
        )
        
        saved_results = SavedPost.sql(
            "SELECT id FROM saved_posts WHERE user_id = %(user_id)s AND post_id = %(post_id)s AND is_active = true",
            {"user_id": user_id, "post_id": post.id}
        )
        
        enriched_posts.append({
            "post": post.model_dump(),
            "author": user.model_dump() if user else None,
            "is_liked": bool(like_results),
            "is_saved": bool(saved_results)
        })
        
    return enriched_posts


@public
def like_post(user_id: UUID, post_id: UUID) -> Dict:
    """Like or unlike a post."""
    
    # Check if already liked
    existing_like = PostLike.sql(
        "SELECT * FROM post_likes WHERE user_id = %(user_id)s AND post_id = %(post_id)s",
        {"user_id": user_id, "post_id": post_id}
    )
    
    if existing_like:
        # Toggle like status
        like = PostLike(**existing_like[0])
        like.is_active = not like.is_active
        like.sync()
        action = "liked" if like.is_active else "unliked"
    else:
        # Create new like
        like = PostLike(user_id=user_id, post_id=post_id)
        like.sync()
        action = "liked"
    
    # Update post likes count
    likes_count = len(PostLike.sql(
        "SELECT id FROM post_likes WHERE post_id = %(post_id)s AND is_active = true",
        {"post_id": post_id}
    ))
    
    TravelPost.sql(
        "UPDATE travel_posts SET likes_count = %(count)s WHERE id = %(post_id)s",
        {"count": likes_count, "post_id": post_id}
    )
    
    return {"action": action, "likes_count": likes_count}


@public
def save_post_to_wishlist(user_id: UUID, post_id: UUID, collection_name: Optional[str] = None, notes: Optional[str] = None) -> Dict:
    """Save a post to user's wishlist."""
    
    # Check if already saved
    existing_save = SavedPost.sql(
        "SELECT * FROM saved_posts WHERE user_id = %(user_id)s AND post_id = %(post_id)s",
        {"user_id": user_id, "post_id": post_id}
    )
    
    if existing_save:
        # Toggle save status
        saved = SavedPost(**existing_save[0])
        saved.is_active = not saved.is_active
        if saved.is_active and collection_name:
            saved.collection_name = collection_name
        if saved.is_active and notes:
            saved.personal_notes = notes
        saved.updated_at = datetime.now()
        saved.sync()
        action = "saved" if saved.is_active else "unsaved"
    else:
        # Get post info for auto-categorization
        post_results = TravelPost.sql(
            "SELECT location_name, country, city FROM travel_posts WHERE id = %(post_id)s",
            {"post_id": post_id}
        )
        
        location_category = None
        if post_results:
            post_data = post_results[0]
            location_category = post_data.get("city") or post_data.get("country") or post_data.get("location_name")
        
        # Create new save
        saved = SavedPost(
            user_id=user_id,
            post_id=post_id,
            collection_name=collection_name,
            location_category=location_category,
            personal_notes=notes
        )
        saved.sync()
        action = "saved"
    
    # Update post saves count
    saves_count = len(SavedPost.sql(
        "SELECT id FROM saved_posts WHERE post_id = %(post_id)s AND is_active = true",
        {"post_id": post_id}
    ))
    
    TravelPost.sql(
        "UPDATE travel_posts SET saves_count = %(count)s WHERE id = %(post_id)s",
        {"count": saves_count, "post_id": post_id}
    )
    
    return {"action": action, "saves_count": saves_count}


@public
def follow_user(follower_id: UUID, following_id: UUID) -> Dict:
    """Follow or unfollow a user."""
    
    # Check if already following
    existing_follow = Follow.sql(
        "SELECT * FROM follows WHERE follower_id = %(follower_id)s AND following_id = %(following_id)s",
        {"follower_id": follower_id, "following_id": following_id}
    )
    
    if existing_follow:
        # Toggle follow status
        follow = Follow(**existing_follow[0])
        follow.is_active = not follow.is_active
        follow.sync()
        action = "followed" if follow.is_active else "unfollowed"
    else:
        # Create new follow
        follow = Follow(follower_id=follower_id, following_id=following_id)
        follow.sync()
        action = "followed"
    
    # Update follower/following counts
    followers_count = len(Follow.sql(
        "SELECT id FROM follows WHERE following_id = %(user_id)s AND is_active = true",
        {"user_id": following_id}
    ))
    
    following_count = len(Follow.sql(
        "SELECT id FROM follows WHERE follower_id = %(user_id)s AND is_active = true",
        {"user_id": follower_id}
    ))
    
    TravelUser.sql(
        "UPDATE travel_users SET followers_count = %(count)s WHERE id = %(user_id)s",
        {"count": followers_count, "user_id": following_id}
    )
    
    TravelUser.sql(
        "UPDATE travel_users SET following_count = %(count)s WHERE id = %(user_id)s",
        {"count": following_count, "user_id": follower_id}
    )
    
    return {"action": action, "followers_count": followers_count}


@public
def get_user_saved_posts(user_id: UUID, location_filter: Optional[str] = None, collection_filter: Optional[str] = None) -> List[Dict]:
    """Get user's saved posts organized by location/collection."""
    
    query = "SELECT * FROM saved_posts WHERE user_id = %(user_id)s AND is_active = true"
    params = {"user_id": user_id}
    
    if location_filter:
        query += " AND location_category = %(location)s"
        params["location"] = location_filter
    
    if collection_filter:
        query += " AND collection_name = %(collection)s"
        params["collection"] = collection_filter
    
    query += " ORDER BY created_at DESC"
    
    saved_results = SavedPost.sql(query, params)
    
    enriched_saves = []
    for save_data in saved_results:
        saved = SavedPost(**save_data)
        
        # Get the actual post
        post_results = TravelPost.sql(
            "SELECT * FROM travel_posts WHERE id = %(post_id)s",
            {"post_id": saved.post_id}
        )
        
        if post_results:
            post = TravelPost(**post_results[0])
            enriched_saves.append({
                "saved_post": saved.model_dump(),
                "post": post.model_dump()
            })
    
    return enriched_saves


@public
def get_saved_locations(user_id: UUID) -> List[Dict]:
    """Get unique locations from user's saved posts for organization."""
    
    results = SavedPost.sql(
        "SELECT location_category, COUNT(*) as post_count FROM saved_posts WHERE user_id = %(user_id)s AND is_active = true AND location_category IS NOT NULL GROUP BY location_category ORDER BY post_count DESC",
        {"user_id": user_id}
    )
    
    return [{"location": row["location_category"], "count": row["post_count"]} for row in results]


@public
def create_travel_post(user_id: UUID, caption: str, images: List[str], location_name: str, country: str, post_type: str, category: str, tags: List[str], city: Optional[str] = None, booking_info: Optional[Dict] = None) -> TravelPost:
    """Create a new travel post."""
    
    post = TravelPost(
        user_id=user_id,
        caption=caption,
        images=images,
        location_name=location_name,
        country=country,
        city=city,
        post_type=post_type,
        category=category,
        tags=tags,
        booking_info=booking_info
    )
    post.sync()
    
    # Update user's post count
    TravelUser.sql(
        "UPDATE travel_users SET posts_count = posts_count + 1 WHERE id = %(user_id)s",
        {"user_id": user_id}
    )
    
    return post
