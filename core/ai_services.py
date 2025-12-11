from typing import List, Dict, Optional
from openai import OpenAI
import os
import json
from uuid import UUID, uuid4
from core.travel_post import TravelPost
from core.travel_user import TravelUser
from solar.access import public
from datetime import datetime

# La clave API de OpenAI se inyectará en el entorno
# Inicialización opcional: solo si existe la clave
try:
    api_key = os.environ.get("OPENAI_API_KEY")
    if api_key:
        client = OpenAI(api_key=api_key)
    else:
        client = None
except Exception as e:
    print(f"Warning: OpenAI client could not be initialized: {e}")
    client = None

@public
def generate_trip_recommendations(
    user_id: UUID,
    goals: List[str],
    location: Optional[str] = None,
    duration: Optional[str] = None
) -> List[TravelPost]:
    """
    Genera recomendaciones de viaje basadas en los objetivos del usuario
    utilizando la API de OpenAI y las guarda como TravelPost.
    """
    
    # 1. Definir el prompt del sistema
    system_prompt = (
        "Eres un experto asistente de planificación de viajes. Tu tarea es generar "
        "una lista de 3 actividades o experiencias de viaje altamente atractivas y "
        "coherentes con los objetivos y parámetros proporcionados por el usuario. "
        "Debes responder **únicamente** con un array JSON que contenga 3 objetos. "
        "Cada objeto debe simular una publicación de viaje completa, lista para ser "
        "mostrada en el feed de la aplicación. Los datos deben ser ficticios pero realistas."
    )
    
    # 2. Definir el prompt del usuario
    user_prompt = (
        f"Genera 3 recomendaciones de viaje. "
        f"Objetivos principales: {', '.join(goals)}. "
        f"Ubicación (si aplica): {location if location else 'Cualquier lugar interesante'}. "
        f"Duración (si aplica): {duration if duration else 'Flexible'}. "
        "Asegúrate de que cada recomendación incluya: "
        "1. Un título atractivo. "
        "2. Una descripción detallada y persuasiva. "
        "3. Una URL de imagen de alta calidad (usa Unsplash o Pexels). "
        "4. Una puntuación de reseña (rating) entre 4.5 y 5.0. "
        "5. Un rango de precio realista (ej. '$80-120'). "
        "6. Una duración (ej. '5 hours'). "
        "7. Etiquetas (tags) relevantes (ej. 'romantic', 'foodie'). "
        "8. Información de reserva simulada (bookingInfo) con un precio por persona, un código de afiliado ficticio, duración, rating y priceRange."
    )
    
    # 3. Definir el esquema de respuesta (para forzar el formato JSON)
    response_schema = {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "title": {"type": "string", "description": "Título de la actividad."},
                "description": {"type": "string", "description": "Descripción detallada."},
                "thumbnail": {"type": "string", "description": "URL de la imagen."},
                "rating": {"type": "number", "description": "Puntuación de 4.5 a 5.0."},
                "priceRange": {"type": "string", "description": "Rango de precio."},
                "duration": {"type": "string", "description": "Duración de la actividad."},
                "tags": {"type": "array", "items": {"type": "string"}},
                "bookingInfo": {
                    "type": "object",
                    "properties": {
                        "price": {"type": "string"},
                        "affiliateCode": {"type": "string"},
                        "duration": {"type": "string"},
                        "rating": {"type": "number"},
                        "priceRange": {"type": "string"}
                    },
                    "required": ["price", "affiliateCode", "duration", "rating", "priceRange"]
                }
            },
            "required": ["title", "description", "thumbnail", "rating", "priceRange", "duration", "tags", "bookingInfo"]
        }
    }

    try:
        # Verificar si el cliente de OpenAI está disponible
        if client is None:
            print("OpenAI client is not available. Returning empty recommendations.")
            return []
        
        response = client.chat.completions.create(
            model="gpt-4.1-mini", # Usamos un modelo rápido y eficiente
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object", "schema": response_schema}
        )
        
        # El modelo devuelve un string JSON que debe ser parseado
        json_string = response.choices[0].message.content
        
        # El modelo puede devolver un string JSON que debe ser parseado
        try:
            data = json.loads(json_string)
            raw_recommendations = data if isinstance(data, list) else data.get('recommendations', [])
        except json.JSONDecodeError:
            print("La respuesta de la IA no es un JSON válido")
            return []
        
        # 4. Guardar las recomendaciones como TravelPost en la base de datos
        saved_posts = []
        ai_user_id = user_id 
        
        # Asegurarse de que el usuario existe (simulación de autenticación)
        if not TravelUser.get(ai_user_id):
            TravelUser(id=ai_user_id, username="ai_assistant", display_name="AI Travel Assistant", profile_image_url="https://i.imgur.com/4gQ7r5z.png").sync()
        
        for rec in raw_recommendations:
            # Crear un post ficticio con los datos de la IA
            post = TravelPost(
                user_id=ai_user_id,
                caption=rec.get("description", "Recomendación generada por IA."),
                images=[rec.get("thumbnail", "")],
                location_name=location or "Ubicación Desconocida",
                country="AI Generated",
                city=location.split(",")[0].strip() if location and "," in location else None,
                post_type="activity",
                category="AI_RECOMMENDATION",
                tags=rec.get("tags", []),
                booking_info={
                    "price": rec.get("bookingInfo", {}).get("price", ""),
                    "affiliateCode": rec.get("bookingInfo", {}).get("affiliateCode", str(uuid4())),
                    "duration": rec.get("bookingInfo", {}).get("duration", ""),
                    "rating": rec.get("bookingInfo", {}).get("rating", 0.0),
                    "priceRange": rec.get("bookingInfo", {}).get("priceRange", "")
                },
                is_published=True,
                is_featured=True,
                likes_count=0,
                saves_count=0
            )
            post.sync()
            saved_posts.append(post)
            
        return saved_posts

    except Exception as e:
        # En caso de error de la API (ej. clave no válida), devolvemos un error
        print(f"Error al conectar con la API de OpenAI: {str(e)}")
        return []

# Ejemplo de uso (no se ejecutará en el servicio, solo para referencia)
if __name__ == '__main__':
    # Simulación de la clave API
    os.environ["OPENAI_API_KEY"] = "sk-..." 
    
    # Simulación de la llamada
    recommendations = generate_trip_recommendations(
        user_id=UUID("00000000-0000-0000-0000-000000000001"),
        goals=["Family Bonding", "Explore Local Gems"],
        location="Kyoto, Japan",
        duration="7 days"
    )
    print(json.dumps([r.__dict__ for r in recommendations], indent=2))
