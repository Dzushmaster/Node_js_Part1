#include <iostream>
#include <clocale>
#include <ctime>

#include "Errors.h"
#include "Winsock2.h"                
#pragma comment(lib, "WS2_32.lib")   

int main()
{
    setlocale(LC_ALL, "rus");

    WSADATA wsaData;      
    SOCKET  sS;       
    SOCKET cS;
    SOCKADDR_IN serv;                    
    serv.sin_family = AF_INET;            
    serv.sin_port = htons(2000);        
    serv.sin_addr.s_addr = INADDR_ANY;  

    try {
        std::cout << "ServerT\n\n";

        if (WSAStartup(MAKEWORD(2, 0), &wsaData) != 0) {
            throw  SetErrorMsgText("Startup: ", WSAGetLastError());
        }
        if ((sS = socket(AF_INET, SOCK_STREAM, NULL)) == INVALID_SOCKET) {
            throw  SetErrorMsgText("socket: ", WSAGetLastError());
        }
        if (bind(sS, (LPSOCKADDR)&serv, sizeof(serv)) == SOCKET_ERROR) {
            throw  SetErrorMsgText("bind: ", WSAGetLastError());
        }
        if (listen(sS, SOMAXCONN) == SOCKET_ERROR) {
            throw SetErrorMsgText("listen: ", WSAGetLastError());
        }

        SOCKADDR_IN clnt;                       
        memset(&clnt, 0, sizeof(clnt));         
        int lclnt = sizeof(clnt);               

        clock_t start, end;
        char ibuf[50] = "", obuf[50] = "server: принято ";
        int libuf = 0, lobuf = 0;     
        bool flag = true;

        while (true) {
            if ((cS = accept(sS, (sockaddr*)&clnt, &lclnt)) == INVALID_SOCKET) {
                throw SetErrorMsgText("accept: ", WSAGetLastError());
            }

            while (true) {
                if ((libuf = recv(cS, ibuf, sizeof(ibuf), NULL)) == SOCKET_ERROR) {
                    continue;
                    throw SetErrorMsgText("recv: ", WSAGetLastError());
                }
                else {
                    if (flag) {
                        flag = !flag;
                        start = clock();
                    }
                }

                std::string obuf = ibuf;
                if ((lobuf = send(cS, obuf.c_str(), strlen(obuf.c_str()) + 1, NULL)) == SOCKET_ERROR) {
                    throw SetErrorMsgText("send: ", WSAGetLastError());
                }

                if (strcmp(ibuf, "") == 0) {
                    flag = true;
                    end = clock();
                    std::cout << "Общее время на send и recv: " << ((double)(end - start) / CLK_TCK) << " c\n\n";
                    break;
                }
                else {
                    std::cout << ibuf << std::endl;
                }
            }
        }

        closesocket(cS) == SOCKET_ERROR;
        closesocket(sS) == SOCKET_ERROR;
        if (WSACleanup() == SOCKET_ERROR) {
            throw  SetErrorMsgText("Cleanup: ", WSAGetLastError());
        }
    }
    catch (std::string errorMsgText) {
        WSACleanup();
        std::cout << '\n' << errorMsgText;
    }

    system("pause");
    return 0;
}