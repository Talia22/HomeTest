import java.util.Scanner;

public class TwitterTowers {

	public static void main(String[] args) 
	{
        Scanner scanner = new Scanner(System.in);
        while (true) {
            System.out.println("Twitter's Tower menu:");
            System.out.println("1. Rectangular Tower");
            System.out.println("2. Triangular Tower");
            System.out.println("3. Exit");
            int choice = scanner.nextInt();
            switch (choice) {
                case 1:
                    rectangularTower(scanner);
                    break;
                case 2:
                    triangularTower(scanner);
                    break;
                case 3:
                    System.out.println("Exiting program.");
                    return;
                default:
                    System.out.println("Invalid option. Please choose again.");
            }
        }
    }
	//function that will print the correct info if the user wanted a rectangular tower.
	private static void rectangularTower(Scanner scanner) 
	{
        System.out.print("Enter desired height for tower:");
        int height = scanner.nextInt();
        System.out.print("Enter desired width for tower:");
        int width = scanner.nextInt();
        if (Math.abs(height - width) > 5 || height == width) 
        {
            System.out.println("Area of the tower: " + (height * width));
        } 
        else 
        {
            System.out.println("perimeter of the tower: " + ((height + width)*2));
        }
		
	}
	//If user asked for triangular tower then it can choose 2 options 
	private static void triangularTower(Scanner scanner) {
        System.out.println("1. perimeter calculation:");
        System.out.print("2. print the triangle:");
        int choice = scanner.nextInt();
        switch (choice) {
            case 1:
            	triangleParimeter(scanner);
                break;
            case 2:
                printTriangle(scanner);
                break;
            default:
                System.out.println("Invalid option.");
        }
		
	}
	private static void triangleParimeter(Scanner scanner)
	{
	       System.out.print("Enter desired height for triangler tower:");
           int height = scanner.nextInt();
           System.out.print("Enter desired width for triangler tower:");
           int width = scanner.nextInt();
           double sideLength = Math.sqrt((height * height) + ((width/2) *(width/2)));
           System.out.println("Perimeter of the triangler tower: " + ((sideLength*2) + width));
		
	}
	//prints the tower as instructed in the exercise. 
	private static void printTriangle(Scanner scanner) 
	{ 
	      System.out.print("Enter desired height for triangler tower:");
          int height = scanner.nextInt();
          System.out.print("Enter desired width for triangler tower:");
          int width = scanner.nextInt();
          int row;
	      int amountStarts = (width - 1) / 2 - 1; 
		  if (width % 2 == 0 || width > height*2) 
		  {
			  System.out.println("The triangler tower cannot be printed.");
	      } 
		  if(amountStarts==0)
		  {
			  printRow(width, 1);
			  for ( row = 1; row <= height; row++) //for exsample 
			  {
				  printRow(width, 3);
					  
			  }
			 
		  }
		  else 
		  {
			  int MiddleRows = height - 2; 
		      int repetitions = (MiddleRows / amountStarts); //amount of times we should repeat each row
		      int extraRepetitions = (MiddleRows % amountStarts);//for first rows at the top after single *
		      int currentRepetitions,rep,stars;

		      printRow(width, 1);
		      for (row = 1, stars = 3; row <= amountStarts; row++, stars += 2) 
		      {
		    	  if(row==1 & extraRepetitions!=0)
		    	  {
		    		  currentRepetitions=repetitions+extraRepetitions;
		    	  }
		    	  else 
		    	  {
		    		  currentRepetitions=repetitions;
		    	  }  
		    	  for (rep = 0; rep < currentRepetitions; rep++) 
		    	  {
		    		  printRow(width, stars);
		    	  }
		    	  
		      }
		      if (height > 1) 
		      {
		    	  printRow(width, width);
		    	  
		      }
			  
		  }
	}
	//print the row with the correct amount of * and spaces.
	 private static void printRow(int width, int stars) {
	        int space = (width - stars) / 2;
	        for (int i = 0; i < space; i++) {
	            System.out.print(" ");
	        }
	        for (int i = 0; i < stars; i++) {
	            System.out.print("*");
	        }
	        System.out.println();
	    }


}
