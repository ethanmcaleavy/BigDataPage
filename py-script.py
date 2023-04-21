import sys

def main():
    print("Hello", sys.argv[1], sys.argv[2])
    imagePath = sys.argv[2]
    print(imagePath)

if __name__ == '__main__':
    main()
