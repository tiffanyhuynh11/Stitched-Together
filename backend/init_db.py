import sqlite3

connection = sqlite3.connect('data/database.db')


with open('schema.sql') as f:
    connection.executescript(f.read())

cur = connection.cursor()

cur.execute("INSERT INTO profiles (name, birthday, notes) VALUES (?, ?, ?)",
            ('Jane Doe', '1999-03-01', 'testing')
            )

cur.execute("INSERT INTO profiles (name, birthday, so) VALUES (?, ?, ?)",
            ('John Smith', '1970-12-20', 'Jane')
            )

connection.commit()
connection.close()