## Start: 
We need to install dependencies, let's install in backend we go to `cd backend` and `pip install -r requirements.txt`. After succesfully install run command for start server `uvicorn main:app --reload`. Now go to `cd frontend` and run `npm install` or `npm i`, after installing all dependencies run `npm start`.

## TASK:

### 🍕 Main Dishes (required):

Your task is to build a simple pizza shop app. Design and usability aren’t important here - focus on your business logic code please.
The app has 4 parts: `Pizzeria Selection`, `Pizza Selection`, `Calculations section (Cart)`, and `Order Confirmation Button`.
1st step is a pizzeria selection. After choosing a pizzeria, next step is Pizzeria Menu where user can pick pizza(s) and receive the order's price.

### Pizzeria Data: 
use the data from pizzerias.json to populate a database (of your choice) and create an HTTP endpoint to fetch this information. 
When selecting a pizzeria, don't forget to update a list of pizzas for the corresponding pizzeria.

### Pizza Data:
use the data from pizza_templates.json to populate your database and create an HTTP endpoint to fetch this information.

### Cart:
User can add pizza to cart. You don't need to display pizzas, just show the calculations. You'll need to fetch this data from your backend (data is in settings.json). You'll also need to fetch new information about subtotal/tax/total on adding a pizza to cart.

### Calculations:
Display these fields: subtotal/tax/total. You should get this information from your backend.
The subtotal field is the sum of each pizza’s price multiplied by quantity.
Tax field represents tax applied to a pizza. Some pizzas are taxed, some are not. Pizza’s tax always equals 0 unless a pizza is taxed. Pizza’s tax equals the percentage of its price multiplied by its quantity. Use us_tax_rate from settings.json as tax percent. For example, Pizza’s price is $10, quantity si 2, tax = 10 * 2 * 8.25/100 = 16.5. The tax field is a sum of all taxes.
The total field is a sum of tax and subtotal fields.
Order action should save this cart to your database (no need to display anywhere). 

## My thoughts on my implementation of this task
I use the stack on the back (SQLite3, Python, FastAPI) on the front (React, TypeScript, CSS)

I solved the problem. I decided on a fairly simple method of communicating with the client via local storage, why did I do it exactly? Therefore, I didn’t want to spend a lot of time on architecture in the store or in the same context.

Something like this, I’m sure you’ll like the solution, I wish you a good day and happy holidays