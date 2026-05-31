from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 📦 Data structure
class Item(BaseModel):
    name: str
    quantity: int
    minStock: int
    lastPurchasedDays: int

class GroceryData(BaseModel):
    items: List[Item]

# 🤖 AI Suggestion API
@app.post("/suggest")
def suggest(data: GroceryData):
    suggestions = []

    for item in data.items:

        # 🔴 Low stock
        if item.quantity <= item.minStock:
            suggestions.append(f"{item.name} is below minimum stock!")

        if item.quantity == 0:
            suggestions.append(f"{item.name} is out of stock!")

        # 🔁 Usage pattern
        if item.lastPurchasedDays <= 2:
            suggestions.append(f"🔁 You use {item.name} very often.")

        if item.lastPurchasedDays > 7:
           suggestions.append(f"You haven't bought {item.name} in a while.")

        # 📦 Overstock
        if item.quantity > item.minStock + 10:
            suggestions.append(f"📦 Too much {item.name}, skip buying.")

    # 🧠 Combo intelligence
    names = [item.name.lower() for item in data.items]

    if "milk" in names and "bread" not in names:
        suggestions.append("🥪 Milk detected → consider buying bread.")

    if "rice" in names and "dal" not in names:
        suggestions.append("🍛 Rice detected → dal missing.")

    if "egg" in names and "bread" not in names:
        suggestions.append("🍳 Eggs + bread = good combo.")

    if not suggestions:
        suggestions.append("✅ Inventory looks perfectly balanced!")

    return {"suggestions": suggestions}