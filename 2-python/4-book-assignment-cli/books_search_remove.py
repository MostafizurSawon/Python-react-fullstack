from time import sleep
from lent_and_backup import *

def create_book(books):
  authors = ""
  title = input('Book Title: ')
  isbn = input('Book ISBN: ')
  
  while True:
    try:
        year = int(input('Book Publishing Year: '))
        break
    except ValueError:
        print("Invalid input. Please enter a valid year.")
  while True:
    try:
        quantity = int(input('Book Quantity: '))
        break
    except ValueError:
        print("Invalid input. Please enter a valid number for the book quantity.")
  while True:
    try:
        price = float(input('Book Price: '))
        break
    except ValueError:
        print("Invalid input. Please enter a valid number for the book price.")
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
  
  new_book = {
    "title": title,
    "isbn": isbn,
    "year": year,
    "price": price,
    "quantity": quantity,
    "authors": authors,
  }
  
  books.append(new_book)
  print('Adding book....Please wait....')
  sleep(1)
  print('Book added successfully!')
  
  with open("books_backup.csv", "wt") as fp:
    for book in books:
      line = f"{book['title']},{book['isbn']},{book['year']},{book['price']},{book['quantity']},{book['authors']}\n"
      fp.write(line)
      
  return books
  
def view_books(books):
  print("##################################################### All Books List ###################################################\n")
  print(f"Title \t\t ISBN \t\t\t Published Year \t Price \t\t Quantity \t Authors")
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
      
    line = f"{book['title']} \t{book['isbn']} \t  {book['year']} \t\t\t$ {book['price']} \t   {book['quantity']} \t\t{auth}"
    print(line)
  
  print("\n##################################################### Books List Ends ###################################################\n")
  return books
   
def search_books(cat, books):
  if cat == 'auth':
    search_term = input("Book search by Author name: ")
    
  else:
    search_term = input("Book search: ")
  q = 0
  print('')
  for book in books:
    if cat == 'auth':
      condition = search_term.lower() in book["authors"].lower()
    else:
      condition = search_term.lower() in book["title"].lower() or search_term in book["isbn"]
    if condition:
      q+=1
      for t in books:
        if t['title'] == book["title"]:
          auth = ""
          line_splitted = book['authors'].strip().split("#")
          for l in line_splitted:
            if len(auth):
              auth+= ', '+l
            else:
              auth+= l
      
      line = f"Result: {q} -> Title: {book['title']}  ISBN:{book['isbn']} Published Year:{book['year']}  Price:{book['price']}  Quantity:{book['quantity']} Author: {auth}"
      print(line)
  print('\nTotal Found Books:', q)
  return books
 
def remove_book(books):
    search_term = input("Enter text to search to remove: ")
    verify = []
    flag = False
    for index, book in enumerate(books):
      if search_term.lower() in book["title"].lower():
        for t in books:
          if t['title'] == book["title"]:
            auth = ""
            line_splitted = book['authors'].strip().split("#")
            for l in line_splitted:
              if len(auth):
                auth+= ', '+l
              else:
                auth+= l
            verify.append(index)
            line = f"{index+1} -> Title: {book['title']}  ISBN:{book['isbn']} Published Year:{book['year']}  Price:{book['price']}  Quantity:{book['quantity']} Author: {auth}"
            print(line)
            flag = True
    
    if flag:  
      selected_index = input("Enter a number to remove: ")
      selected_index = int(selected_index)-1
    else:
      print("\nNo result Found!\n")
      print('Exiting....')
      sleep(1)
      return books

    if selected_index in verify:
      books.pop(selected_index)
    else:
      print("\nThis book is not available to remove!\n")

    print("Book removing... Please wait...")
    sleep(1)
    backup_books(books)
    print("Book removed successfully!")
    return books

