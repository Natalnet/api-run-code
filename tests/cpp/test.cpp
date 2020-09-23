#include<iostream>
using namespace std;

int main() {
    
    int n;
    
    for (int n = 1; n <= 10; ++n) {
        for (int i = 1; i <= 10; ++i) {
            cout << n << " x " << i << " = " << n*i << endl;
        }
    }
    
    return 0;
}