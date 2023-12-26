from decimal import ROUND_HALF_UP, Decimal
import json
from fastapi import FastAPI, HTTPException
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, condecimal
import sqlite3

app = FastAPI()

class Config:
    pizzerias_file_path = "assets/pizzerias.json"
    pizza_templates_file_path = "assets/pizza_templates.json"
    settings_file_path = "assets/settings.json"
    database_file_path = "orders.db"

config = Config()

with open(config.pizzerias_file_path, "r") as json_file:
    pizza_restaurants = json.load(json_file)

with open(config.pizza_templates_file_path, "r") as json_file:
    pizza_templates = json.load(json_file)

with open(config.settings_file_path, "r") as json_file:
    taxes = json.load(json_file)

conn = sqlite3.connect(config.database_file_path)
cursor = conn.cursor()

origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_filtered_pizzerias(country):
    return [
        {
            "id": restaurant["id"],
            "name": restaurant["name"],
            "address": restaurant["address"],
            "country": restaurant["country"]
        }
        for restaurant in pizza_restaurants
        if restaurant["country"] == country
    ]

def get_pizzas_for_pizzeria(pizzeria_id):
    return [
        pizza
        for pizza in pizza_templates
        if pizzeria_id in pizza["available_in_pizzerias"]
    ]

def get_pizza_by_id(pizza_id: int):
    for pizza in pizza_templates:
        if pizza["id"] == pizza_id:
            return pizza
    return None

def calculate_cart_data(cart_items):
    cart_data = {"subtotal": Decimal("0.00"), "tax": Decimal("0.00"), "total": Decimal("0.00")}
    
    for item in cart_items:
        pizza_id, quantity = item.pizza_id, item.quantity
        pizza = get_pizza_by_id(pizza_id)

        if not pizza:
            raise HTTPException(status_code=404, detail=f"Pizza with ID {pizza_id} not found")

        pizza_price = Decimal(str(pizza["price"]))
        if pizza.get("is_taxed", False):
            tax = pizza_price * quantity * Decimal(str(taxes["us_tax_rate"])) / Decimal("100.00")
        else:
            tax = Decimal("0.00")

        subtotal = pizza_price * quantity
        total = subtotal + tax

        cart_data["subtotal"] += subtotal.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        cart_data["tax"] += tax.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        cart_data["total"] += total.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    
    return cart_data

# Pydantic Models
class CartItem(BaseModel):
    pizza_id: int
    quantity: int = 1

class Pizza(BaseModel):
    id: int
    name: str
    price: condecimal(decimal_places=2)
    is_taxed: bool
    description: str
    image_url: str
    available_in_pizzerias: List[int]
    quantity: int

class PizzaCart(BaseModel):
    country: str
    pizzeria_name: str
    cart_items: List[Pizza]

# API Endpoints
@app.get("/pizzerias", response_model=List[dict])
async def get_pizzerias_in_country(country):
    filtered_pizzerias = get_filtered_pizzerias(country)

    if not filtered_pizzerias:
        raise HTTPException(status_code=404, detail="No pizzerias found for the given country")

    return filtered_pizzerias

@app.get("/pizzas_in_pizzeria/", response_model=List[dict])
async def get_pizzas_in_pizzeria(pizzeria_id: int):    
    pizzas_in_pizzeria = get_pizzas_for_pizzeria(pizzeria_id)
    
    if not pizzas_in_pizzeria:
        raise HTTPException(status_code=404, detail=f"No pizzas found for pizzeria ID {pizzeria_id}")

    return pizzas_in_pizzeria

@app.post("/add_to_cart", response_model=dict)
async def add_to_cart(cart_items: List[CartItem]):
    cart_data = calculate_cart_data(cart_items)
    return cart_data

@app.post("/complete_order")
async def add_to_cart(order_items: List[PizzaCart]):
    with sqlite3.connect(config.database_file_path) as conn:
        cursor = conn.cursor()

        for item in order_items:
            country, pizzeria_name = item.country, item.pizzeria_name
            for pizza in item.cart_items:
                pizza_name, pizza_quantity = pizza.name, pizza.quantity
                cursor.execute("INSERT INTO order_items (pizzeria_name, country, pizza_name, quantity) VALUES (?, ?, ?, ?)", (pizzeria_name, country, pizza_name, pizza_quantity))

        conn.commit()

    return {"message": "Order completed successfully"}
