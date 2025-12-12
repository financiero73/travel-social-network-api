#!/usr/bin/env python3
"""
Script para inicializar la base de datos con tablas y datos de prueba.
"""
import sys
import os
from pathlib import Path

# Añadir el directorio services al path
sys.path.insert(0, str(Path(__file__).parent))

from dotenv import load_dotenv
load_dotenv(Path(__file__).parent / ".env")

from core.travel_user import TravelUser
from core.travel_post import TravelPost
from core.follow import Follow
from core.post_like import PostLike
from core.saved_post import SavedPost

from uuid import uuid4
from datetime import datetime, timedelta
import random

def create_tables():
    """Crear todas las tablas necesarias."""
    print("🔨 Creando tablas...")
    
    # Verificar que las clases tengan __table_name__ definido
    if not hasattr(TravelUser, '__table_name__'):
        TravelUser.__table_name__ = "travel_users"
    if not hasattr(TravelPost, '__table_name__'):
        TravelPost.__table_name__ = "travel_posts"
    if not hasattr(Follow, '__table_name__'):
        Follow.__table_name__ = "follows"
    if not hasattr(PostLike, '__table_name__'):
        PostLike.__table_name__ = "post_likes"
    if not hasattr(SavedPost, '__table_name__'):
        SavedPost.__table_name__ = "saved_posts"
    
    try:
        TravelUser.create_table()
        print("  ✓ Tabla travel_users creada")
    except Exception as e:
        print(f"  ⚠ travel_users: {e}")
        import traceback
        traceback.print_exc()
    
    try:
        TravelPost.create_table()
        print("  ✓ Tabla travel_posts creada")
    except Exception as e:
        print(f"  ⚠ travel_posts: {e}")
        import traceback
        traceback.print_exc()
    
    try:
        Follow.create_table()
        print("  ✓ Tabla follows creada")
    except Exception as e:
        print(f"  ⚠ follows: {e}")
        import traceback
        traceback.print_exc()
    
    try:
        PostLike.create_table()
        print("  ✓ Tabla post_likes creada")
    except Exception as e:
        print(f"  ⚠ post_likes: {e}")
        import traceback
        traceback.print_exc()
    
    try:
        SavedPost.create_table()
        print("  ✓ Tabla saved_posts creada")
    except Exception as e:
        print(f"  ⚠ saved_posts: {e}")
        import traceback
        traceback.print_exc()

def seed_data():
    """Poblar la base de datos con datos de prueba."""
    print("\n🌱 Poblando base de datos con datos de prueba...")
    
    # Crear usuarios de prueba
    users_data = [
        {
            "username": "sarah_wanderlust",
            "email": "sarah@wanderlust.com",
            "display_name": "Sarah Anderson",
            "profile_image_url": "https://i.pravatar.cc/150?img=1",
            "is_verified": True,
            "bio": "Travel blogger | 🌍 Exploring the world one country at a time"
        },
        {
            "username": "marco_eats_world",
            "email": "marco@foodtravel.com",
            "display_name": "Marco Rossi",
            "profile_image_url": "https://i.pravatar.cc/150?img=12",
            "is_verified": True,
            "bio": "Food & Travel | 🍜 Finding the best local eats worldwide"
        },
        {
            "username": "adventure_alex",
            "email": "alex@adventure.com",
            "display_name": "Alex Chen",
            "profile_image_url": "https://i.pravatar.cc/150?img=8",
            "is_verified": False,
            "bio": "Adventure seeker | ⛰️ Mountains, hiking, and off-grid living"
        }
    ]
    
    users = []
    for user_data in users_data:
        user = TravelUser(
            id=uuid4(),
            username=user_data["username"],
            email=user_data["email"],
            display_name=user_data["display_name"],
            profile_image_url=user_data["profile_image_url"],
            bio=user_data["bio"],
            is_verified=user_data["is_verified"],
            followers_count=random.randint(1000, 50000),
            following_count=random.randint(100, 1000),
            posts_count=0
        )
        user.sync()
        users.append(user)
        print(f"  ✓ Usuario creado: {user.username}")
    
    # Crear posts de prueba
    posts_data = [
        {
            "user": users[0],
            "caption": "Sunrise yoga session overlooking the rice terraces in Ubud! 🧘‍♀️ This moment of peace before the world wakes up is exactly why I fell in love with Bali.",
            "images": ["https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=800&fit=crop"],
            "location_name": "Tegallalang Rice Terraces",
            "country": "Indonesia",
            "city": "Ubud",
            "post_type": "experience",
            "category": "wellness",
            "tags": ["yoga", "sunrise", "bali", "mindfulness"]
        },
        {
            "user": users[1],
            "caption": "BEST ramen I've ever had! 🍜 This tiny 8-seat shop in Shibuya has been perfecting their tonkotsu recipe for 45 years. The broth is so rich it coats the spoon!",
            "images": ["https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=800&h=800&fit=crop"],
            "location_name": "Menya Saimi Shibuya",
            "country": "Japan",
            "city": "Tokyo",
            "post_type": "food",
            "category": "restaurant",
            "tags": ["ramen", "tokyo", "authentic", "local_favorite"]
        },
        {
            "user": users[2],
            "caption": "Camping under the Northern Lights in Iceland! ⛺ One of the most magical experiences of my life. No filter needed when nature puts on a show like this.",
            "images": ["https://images.unsplash.com/photo-1579033461380-adb47c3eb938?w=800&h=800&fit=crop"],
            "location_name": "Thingvellir National Park",
            "country": "Iceland",
            "city": "Thingvellir",
            "post_type": "experience",
            "category": "nature",
            "tags": ["northern_lights", "camping", "iceland", "adventure"]
        }
    ]
    
    posts = []
    for post_data in posts_data:
        post = TravelPost(
            id=uuid4(),
            user_id=post_data["user"].id,
            caption=post_data["caption"],
            images=post_data["images"],
            location_name=post_data["location_name"],
            country=post_data["country"],
            city=post_data["city"],
            post_type=post_data["post_type"],
            category=post_data["category"],
            tags=post_data["tags"],
            booking_info={
                "price": f"${random.randint(20, 200)}",
                "affiliate_code": f"CODE_{random.randint(1000, 9999)}"
            },
            likes_count=random.randint(100, 5000),
            saves_count=random.randint(50, 1000),
            comments_count=random.randint(10, 500),
            is_published=True,
            is_featured=random.choice([True, False]),
            created_at=datetime.now() - timedelta(days=random.randint(1, 30)),
            updated_at=datetime.now()
        )
        post.sync()
        posts.append(post)
        print(f"  ✓ Post creado: {post.location_name}")
        
        # Actualizar contador de posts del usuario
        post_data["user"].posts_count += 1
        post_data["user"].sync()
    
    # Crear algunas relaciones de seguimiento
    follow1 = Follow(
        id=uuid4(),
        follower_id=users[0].id,
        following_id=users[1].id,
        is_active=True,
        created_at=datetime.now()
    )
    follow1.sync()
    
    follow2 = Follow(
        id=uuid4(),
        follower_id=users[0].id,
        following_id=users[2].id,
        is_active=True,
        created_at=datetime.now()
    )
    follow2.sync()
    
    print(f"  ✓ Relaciones de seguimiento creadas")
    
    # Crear algunos likes
    for i in range(3):
        like = PostLike(
            id=uuid4(),
            user_id=users[i % len(users)].id,
            post_id=posts[i % len(posts)].id,
            is_active=True,
            created_at=datetime.now()
        )
        like.sync()
    
    print(f"  ✓ Likes creados")
    
    print("\n✅ Base de datos inicializada correctamente!")
    print(f"   - {len(users)} usuarios creados")
    print(f"   - {len(posts)} posts creados")
    print(f"   - Relaciones y likes configurados")

if __name__ == "__main__":
    print("=" * 60)
    print("  INICIALIZACIÓN DE BASE DE DATOS - TRAVEL APP")
    print("=" * 60)
    
    try:
        create_tables()
        seed_data()
    except Exception as e:
        print(f"\n❌ Error durante la inicialización: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
