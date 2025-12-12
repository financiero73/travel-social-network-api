"""
Database migration script to fix schema issues and create new tables.
"""
import asyncio
from solar.table import get_pool
from solar.config import config

async def main():
    print("Starting database migration...")
    
    # Get database connection
    pg_key = "NEON_CONN_URL"  # or whatever key your DB uses
    pool = get_pool()
    
    with pool[pg_key].getconn() as conn:
        with conn.cursor() as cursor:
            print("\n1. Fixing saved_posts table...")
            try:
                # Check if location_category column exists
                cursor.execute("""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name='saved_posts' AND column_name='location_category'
                """)
                if cursor.fetchone():
                    cursor.execute("ALTER TABLE saved_posts DROP COLUMN IF EXISTS location_category CASCADE")
                    print("   ✅ Removed location_category column from saved_posts")
                else:
                    print("   ℹ️  location_category column doesn't exist (already fixed)")
            except Exception as e:
                print(f"   ⚠️  Error fixing saved_posts: {e}")
            
            print("\n2. Fixing follows table...")
            try:
                # Check if notification_enabled column exists
                cursor.execute("""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name='follows' AND column_name='notification_enabled'
                """)
                if cursor.fetchone():
                    cursor.execute("ALTER TABLE follows DROP COLUMN IF EXISTS notification_enabled CASCADE")
                    print("   ✅ Removed notification_enabled column from follows")
                else:
                    print("   ℹ️  notification_enabled column doesn't exist (already fixed)")
            except Exception as e:
                print(f"   ⚠️  Error fixing follows: {e}")
            
            print("\n3. Creating reviews table...")
            try:
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS reviews (
                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        post_id UUID NOT NULL,
                        user_id UUID NOT NULL,
                        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
                        comment TEXT,
                        helpful_count INTEGER DEFAULT 0,
                        created_at TIMESTAMP DEFAULT NOW(),
                        updated_at TIMESTAMP DEFAULT NOW(),
                        is_active BOOLEAN DEFAULT TRUE,
                        UNIQUE(user_id, post_id)
                    )
                """)
                print("   ✅ Created reviews table")
            except Exception as e:
                print(f"   ⚠️  Error creating reviews table: {e}")
            
            print("\n4. Creating review_votes table...")
            try:
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS review_votes (
                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        review_id UUID NOT NULL,
                        user_id UUID NOT NULL,
                        is_helpful BOOLEAN NOT NULL,
                        created_at TIMESTAMP DEFAULT NOW(),
                        is_active BOOLEAN DEFAULT TRUE,
                        UNIQUE(user_id, review_id)
                    )
                """)
                print("   ✅ Created review_votes table")
            except Exception as e:
                print(f"   ⚠️  Error creating review_votes table: {e}")
            
            # Commit all changes
            conn.commit()
            print("\n✅ Migration completed successfully!")

if __name__ == "__main__":
    asyncio.run(main())
