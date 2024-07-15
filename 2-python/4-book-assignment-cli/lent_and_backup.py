from time import sleep

def lent_book(books,lents):
  name = input("Your Name: ")
  for items in lents:
    if name.lower() == items['user'].lower():
      print(f"\nHello Mr. {name} You can lent only 1 book at a time.\n\nPlease return your book First!\n")
      print("Exiting...")
      sleep(1)
      return books, lents
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
          verify.append(index+1)
          line = f"{index+1} -> Title: {book['title']}  ISBN:{book['isbn']} Published Year:{book['year']}  Price:{book['price']}  Quantity:{book['quantity']} Author: {auth}"
          print(line)
      
  if flag:
    selected_index = input("Enter a number to lent: ")
    selected_index = int(selected_index)
    
    if selected_index in verify:
      quantity = int(books[selected_index-1]['quantity'])
      if quantity:
        if quantity==1:
          print(f"\nSorry {books[selected_index-1]['title']} has only one copy available. Last copy can not be lent!\n")
          return books, lents
        books[selected_index-1]['quantity'] = quantity - 1
        lent_book = {
          "title":books[selected_index-1]['title'],
          "user":name,
        }
        lents.append(lent_book)
        
        print("\nProcessing...Please wait...")
        sleep(1)
        print(f"\n{book['title']} lent to {name}\n")
        
        with open("lent_books_backup.csv", "wt") as fp:
          for lent in lents:
            line = f"{lent['title']},{lent['user']}\n"
            fp.write(line)
        
        backup_books(books)
        # print(lents)
      else:
        print("\nNot enough books available to lend!\n")
    else:
      print("\nSelect correct number.\n")
      
  else:
    print("\nNothing Found!\n")
  
  return books,lents

def backup_books(books):
  with open("books_backup.csv", "wt") as fp:
    for book in books:
      line = f"{book['title']},{book['isbn']},{book['year']},{book['price']},{book['quantity']},{book['authors']}\n"
      fp.write(line)
  return books
    
def restore_books(books):
  with open("books_backup.csv", "r") as fp:
    for line in fp.readlines():
        line_splitted = line.strip().split(",")
        book = {
            "title":line_splitted[0],
            "isbn":line_splitted[1],
            "year":line_splitted[2],
            "price":line_splitted[3],
            "quantity":line_splitted[4],
            "authors":line_splitted[5],
        }
        books.append(book)

  # print("Books Restored!")
  return books
  
def restore_lents(lents):
  with open("lent_books_backup.csv", "r") as fp:
    for line in fp.readlines():
        line_splitted = line.strip().split(",")
        lent_list = {
            "title":line_splitted[0],
            "user":line_splitted[1],
        }
        lents.append(lent_list)

  # print("Lents Restored!", lents)
  return lents
  
def all_lent_books(books,lents):
  print("\n#################################################### All Lents Books ##################################################\n")
  index = 1
  for book in books:
    for lent in lents:
      if lent['title'] in book['title']:
        auth = ""
        line_splitted = book['authors'].strip().split("#")
        for l in line_splitted:
          if len(auth):
            auth+= ', '+l
          else:
            auth+= l
          
        line = f"{index}. User: {lent['user']}  Book: {book['title']} ISBN: {book['isbn']}  Published Year: {book['year']} Price: {book['price']}  Quantity: {book['quantity']} Authors: {auth}"
        print(line) 
        index+=1 
  print("\n################################################## Lents Books List Ends ################################################\n")
  return books,lents

def return_book(books, lents):
  name = input("Your Name: ")
  book_lent = ''
  flag = False
  for lent in lents:
    if name.lower() in lent['user'].lower():
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
            line = f"Your Lent Book -> Title: {book['title']}  ISBN:{book['isbn']} Published Year:{book['year']}  Price:{book['price']}  Author: {auth}"
            print(line,'\n')
            
            print(f"Returning {book['title']}... Please wait......")
            sleep(1)
            

            book['quantity'] = int(book['quantity'])+1
  
    for index,lent in enumerate(lents):
      if lent['user'].lower() == name:
        # print(lent,name)
        lents.pop(index)
        restore_lents()
        print('\nReturned Successfully!\n')
            
        print("Updating Books Server...Please wait......\n")
        sleep(1)
        backup_books()
        print('Books server is now updated!\n')
        return
  else:
    print("You have not lent any books.\n")
    print('Exiting...')
    sleep(1)
  
  return books,lents
 