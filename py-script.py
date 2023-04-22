import sys

# def main():
#     #print("Hello", sys.argv[1])
#     image = "error.png"
#     print(image)

def start():
    print("started")

def getCeleb(newImage):
    celebImage = "Alter.png"
    print(celebImage)

if __name__ == '__main__':
    if sys.argv[1] == "getCeleb":
        getCeleb(sys.argv[2])
    elif sys.argv[1] == "start":
        start()

