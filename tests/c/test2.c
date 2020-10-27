#include <stdio.h>
#include <math.h>

int main(){
    printf("%lf\n", sqrt(8));
    printf("%lf\n", pow(2,3));
    int t = 0;
    while(t<=2000){
        if(t==1000){
          printf("1\n");
        }
        else if(t==1500){
          printf("2\n");
        }
        else if(t==1840){
         *(int*)0 = 0;
        }
        else{
          printf("a");
        }
        t++;
    }
    return -1;
}