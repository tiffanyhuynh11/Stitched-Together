import sqlite3

connection = sqlite3.connect('data/database.db')


with open('schema.sql') as f:
    connection.executescript(f.read())

cur = connection.cursor()

cur.execute("INSERT INTO profiles (name, birthday, relationship, connection, so, notes, gifts) VALUES (?, ?, ?, ?, ?, ?, ?)",
                 ("Your Name", "", "", "", "", "", ""))


#cur.execute("INSERT INTO profiles (name, birthday, relationship, so, notes, gifts) VALUES (?, ?, ?, ?, ?, ?)",
 #                ("not casey", "1989-03-01", " 2 relationship", "so", "notes", "gifts"))


connection.commit()
connection.close()
