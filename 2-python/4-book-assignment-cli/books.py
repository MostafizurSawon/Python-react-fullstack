import os
from time import sleep

books = []

def create_book():
  authors = ""
  title = input('Book Title: ')
  while True:
    author = input('Book Author: ')
    if author == "e":
      break
    elif author == "":
      print("Write a name.")
    else:
      print('Adding author...')
      sleep(1)
      if len(authors):
        authors+= '#'+author
      else:
        authors += author
      print('Author added successfully!')
    print('\n Press "e" if there is no more authors. \n')
    
  isbn = input('Book ISBN: ')
  year = input('Book Publishing Year: ')
  
  new_book = {
    "title": title,
    "authors": authors,
    "isbn": isbn,
    "year": year,
  }
  
  books.append(new_book)
  print('Adding book....Please wait....')
  sleep(1)
  print('Book added successfully!')
  
  with open("books_backup.csv", "wt") as fp:
    for book in books:
      line = f"{book['title']}, {book['authors']}, {book['isbn']}, {book['year']}\n"
      fp.write(line)
  
  
def view_books():
  print(f"Title \t\t\t Authors \t\t\t ISBN \t\t\t Published Year")
  # print(books)
  for book in books:
    # print(book)
    auth = ""
    line_splitted = book['authors'].strip().split("#")
    for l in line_splitted:
      if len(auth):
        auth+= ', '+l
      else:
        auth+= l
      
    line = f"{book['title']} \t\t {auth} \t\t {book['isbn']} \t\t {book['year']}"
    print(line)
    
def restore_books():
  with open("books_backup.csv", "r") as fp:
    for line in fp.readlines():
        line_splitted = line.strip().split(",")
        book = {
            "title": line_splitted[0],
            "authors": line_splitted[1],
            "isbn": line_splitted[2],
            "year": line_splitted[3],
        }
        books.append(book)

  print("Books Restored!")
  
def check_and_restore_books():
    if os.path.exists("books_backup.csv") and os.path.getsize("books_backup.csv") > 0:
        restore_books()

check_and_restore_books()

  
menu = """
##      Welcome to Abc Library!     ##

1. Add a new book.
2. View all books.
3. Restore backup books.

0. Exit

##    ##    ##    ##    ##    ##    ##
"""


while True:
  print(menu)
  user = input("Your Choice: ")
  if(user == "1"):
    create_book()
  elif(user == "2"):
    view_books()
  elif(user == "3"):
    restore_books()
  elif(user == "0"):
    print("Exiting Now... Please wait........")
    sleep(2)
    print("Please Come again.")
    sleep(1)
    break
  