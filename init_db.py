import asyncio
from solar.access import Table
from solar.table import ColumnDetails
from uuid import UUID
from datetime import datetime

# Define los modelos de la base de datos
class TravelUser(Table):
    __table_name__ = "travel_users"
    id: UUID = ColumnDetails(primary_key=True)
    username: str
    display_name: str
    profile_image_url: str
    is_verified: bool
    followers_count: int
    following_count: int
    posts_count: int

class TravelPost(Table):
    __table_name__ = "travel_posts"
    id: UUID = ColumnDetails(primary_key=True)
    user_id: UUID
    caption: str
    images: list
    location_name: str
    country: str
    city: str
    post_type: str
    category: str
    tags: list
    booking_info: dict
    likes_count: int
    saves_count: int
    is_published: bool
    is_featured: bool
    created_at: datetime

class Follow(Table):
    __table_name__ = "follows"
    id: UUID = ColumnDetails(primary_key=True)
    follower_id: UUID
    following_id: UUID
    is_active: bool

class PostLike(Table):
    __table_name__ = "post_likes"
    id: UUID = ColumnDetails(primary_key=True)
    user_id: UUID
    post_id: UUID
    is_active: bool

class SavedPost(Table):
    __table_name__ = "saved_posts"
    id: UUID = ColumnDetails(primary_key=True)
    user_id: UUID
    post_id: UUID
    collection_name: str
    location_category: str
    personal_notes: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

async def main():
    print("Creando tablas...")
    TravelUser.create_table()
    TravelPost.create_table()
    Follow.create_table()
    PostLike.create_table()
    SavedPost.create_table()
    print("Tablas creadas con éxito.")

if __name__ == "__main__":
    asyncio.run(main())
