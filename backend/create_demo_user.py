#!/usr/bin/env python3
"""Script to create a demo user in the database"""

from core.travel_user import TravelUser
import uuid

# Create demo user
demo_user_id = uuid.UUID('b0a16eea-68b3-4e0f-8409-176b2ff77a8a')

demo_user = TravelUser(
    id=demo_user_id,
    email="demo@travelsocial.com",
    username="demo_user",
    full_name="Demo User",
    bio="Demo user for testing",
    profile_picture_url="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
    is_verified=True
)

demo_user.sync()

print(f"✅ Demo user created successfully!")
print(f"User ID: {demo_user_id}")
print(f"Username: demo_user")
print(f"Email: demo@travelsocial.com")
