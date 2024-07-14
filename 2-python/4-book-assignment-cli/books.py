import os
from time import sleep

books = []
lents = []

def create_book():
  authors = ""
  title = input('Book Title: ')
  isbn = input('Book ISBN: ')
  year = input('Book Publishing Year: ')
  price = input('Book Price: ')
  quantity = input('Book Quantity: ')
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
      line = f"{book['title']}, {book['isbn']}, {book['year']}, {book['price']}, {book['quantity']}, {book['authors']}\n"
      fp.write(line)
  
  
def view_books():
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
      
    line = f"{book['title']} \t{book['isbn']} \t  {book['year']} \t\t{book['price']} \t\t   {book['quantity']} \t\t{auth}"
    print(line)
    
def search_books(cat):
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
  
def remove_book():
    search_term = input("Enter text to search to remove: ")
    
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
      
            line = f"{index+1} -> Title: {book['title']}  ISBN:{book['isbn']} Published Year:{book['year']}  Price:{book['price']}  Quantity:{book['quantity']} Author: {auth}"
            print(line)
            
    selected_index = input("Enter an number to remove: ")
    selected_index = int(selected_index)

    books.pop(selected_index - 1)

    print("Book removing... Please wait...")
    sleep(1)
    backup_books()
    print("Book removed successfully!")
    
    
    
def lent_book():
  name = input("Your Name: ")
  for items in lents:
    if name.lower() in items['user'].lower():
      print("\nHello Mr. {name} You can lent only 1 book at a time.\n\nPlease return your book First!\n")
      print("Exiting...")
      sleep(1)
      return
  book_name = input("Book Name you want to lent: ")
  
  flag = False
  verify = [] # Ensures user selecting correct index
  
  for index, book in enumerate(books):
    
    if book_name.lower() in book['title'].lower():
      flag = True
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
      
  if flag:
    selected_index = input("Enter an number to lent: ")
    selected_index = int(selected_index)
    
    if selected_index in verify:
      quantity = int(books[selected_index-1]['quantity'])
      if quantity:
        books[selected_index-1]['quantity'] = quantity - 1
        lent_book = {
          "title" : books[selected_index-1]['title'],
          "user" : name,
        }
        lents.append(lent_book)
        
        with open("lent_books_backup.csv", "wt") as fp:
          for lent in lents:
            line = f"{lent['title']}, {lent['user']}\n"
            fp.write(line)
        
        backup_books()
        print(lents)
      else:
        print("\nSorry currently this book is not available!\n")
    else:
      print("\nSelect correct number.\n")
      
  else:
    print("\nNothing Found!\n")
  
  
def return_book():
  name = input("Your Name: ")
  book_lent = ''
  flag = False
  for lent in lents:
    if name.lower() in lent['user'].lower():
      # print(name, lent)
      # print(f"\nHello Mr. {name} You can lent only 1 book at a time.\n\nPlease return your book First!\n")
      # print("Exiting...")
      # sleep(1)
      # return
      book_lent = lent['title']
      flag = True
  
  if flag:
    for book in books:
      
      if book_lent == book['title']:
        for t in books:
          if t['title'] == book["title"]:
            auth = ""
            line_splitted = book['authors'].strip().split("#")
            for l in line_splitted:
              if len(auth):
                auth+= ', '+l
              else:
                auth+= l
            line = f"Your Lent Book -> Title: {book['title']}  ISBN:{book['isbn']} Published Year:{book['year']}  Price:{book['price']}  Quantity:{book['quantity']} Author: {auth}"
            print(line,'\n')
            
            print(f"Returning {book['title']}... Please wait......")
            sleep(1)
            

            book['quantity'] = int(book['quantity'])+1

            print('\nReturned Successfully!\n')
            
            print("Updating Books Server...Please wait......\n")
            sleep(1)
            backup_books()
            print('Books server is now updated!\n')
            
  
      for lent in lents:
        if lent['user'].lower() == name:
          lents.pop(lent)
  else:
    print("You have not lent any books.\n")
    print('Exiting...')
    sleep(1)
            
    
    
          
  
    
    
def backup_books():
  with open("books_backup.csv", "wt") as fp:
    for book in books:
      line = f"{book['title']}, {book['isbn']}, {book['year']}, {book['price']}, {book['quantity']}, {book['authors']}\n"
      fp.write(line)
    
def restore_books():
  with open("books_backup.csv", "r") as fp:
    for line in fp.readlines():
        line_splitted = line.strip().split(",")
        book = {
            "title": line_splitted[0],
            "isbn": line_splitted[1],
            "year": line_splitted[2],
            "price": line_splitted[3],
            "quantity": line_splitted[4],
            "authors": line_splitted[5],
        }
        books.append(book)

  print("Books Restored!")
  
def restore_lents():
  with open("lent_books_backup.csv", "r") as fp:
    for line in fp.readlines():
        line_splitted = line.strip().split(",")
        lent_list = {
            "title": line_splitted[0],
            "user": line_splitted[1],
        }
        lents.append(lent_list)

  print("Lents Restored!", lents)
  
def check_and_restore_books():
    if os.path.exists("books_backup.csv") and os.path.getsize("books_backup.csv") > 0:
        restore_books()
    if os.path.exists("lent_books_backup.csv") and os.path.getsize("lent_books_backup.csv") > 0:
        restore_lents()

check_and_restore_books()

  
menu = """
##      Welcome to Abc Library!     ##

1. Add a new book.
2. View all books.
3. Search books by Title or ISBN.
4. Search books by Author's name.
5. Remove a book
6. Lent a book
7. Return a book
8. Restore backup books.

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
    search_books('title')
  elif(user == "4"):
    search_books('auth')
  elif(user == "5"):
    remove_book()
  elif(user == "6"):
    lent_book()
  elif(user == "7"):
    return_book()
  elif(user == "8"):
    restore_books()
  elif(user == "0"):
    print("Exiting Now... Please wait........")
    sleep(2)
    print("Please Come again.")
    sleep(1)
    break
  