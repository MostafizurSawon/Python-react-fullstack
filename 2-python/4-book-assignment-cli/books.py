import os
from time import sleep
from lent_and_backup import *
from books_search_remove import *

books = []
lents = []
  
def check_and_restore_books():
    if os.path.exists("books_backup.csv") and os.path.getsize("books_backup.csv") > 0:
        restore_books(books)
    if os.path.exists("lent_books_backup.csv") and os.path.getsize("lent_books_backup.csv") > 0:
        restore_lents(lents)

check_and_restore_books()

  
menu = """
##      Welcome to Abc Library!     ##

Select an option: 

1. Add a new book.
2. View all books.
3. Search books by Title or ISBN.
4. Search books by Author's name.
5. Remove a book
6. Lent a book
7. Return a book
8. View all Lent books.

0. Exit

##    ##    ##    ##    ##    ##    ##
"""


while True:
  print(menu)

  user = input("Your Choice: ")
  if(user == "1"):
    create_book(books)
  elif(user == "2"):
    print("\nLoading...\n")
    sleep(1)
    view_books(books)
  elif(user == "3"):
    search_books('title', books)
  elif(user == "4"):
    search_books('auth', books)
  elif(user == "5"):
    view_books(books)
    print()
    remove_book(books)
  elif(user == "6"):
    view_books(books)
    lent_book(books,lents)
  elif(user == "7"):
    return_book(books,lents)
  elif(user == "8"):
    print("\nLoading...\n")
    sleep(1)
    all_lent_books(books,lents)
  elif(user == "0"):
    print("Exiting Now... Please wait........")
    sleep(2)
    print("Please Come again.")
    sleep(1)
    break
  else:
    print("\nInvalid Choice.")
    sleep(1)
  