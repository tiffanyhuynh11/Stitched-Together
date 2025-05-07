# taken from Dr.Lee's Colab
import sqlite3

connection = sqlite3.connect('data/database.db')


with open('schema.sql') as f:
    connection.executescript(f.read())

cur = connection.cursor()

# initialize database with User Profile shell
cur.execute("INSERT INTO profiles (name, birthday, relationship, connection, so, notes, gifts) VALUES (?, ?, ?, ?, ?, ?, ?)",
                 ("Your Name", "", "", "", "", "", ""))

connection.commit()
connection.close()
