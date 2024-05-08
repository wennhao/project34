var socket = io();
        socket.on('keypadData', function(data) {
           
            // Create a new div element for each keypad input
            var maxdivs = 4;
            var input = document.getElementById("balanceResult");
            if(input.childElementCount < maxdivs){
            newDiv = document.createElement("div");
            newDiv.textContent = data.key1;

            newDiv.classList.add("keypad");

            // Append the new div to the keypadInputs div
            block = document.getElementById("balanceResult").appendChild(newDiv);
            }
        });


        const form = document.getElementById('balanceForm');
        const balanceResult = document.getElementById('balanceResult');

        socket.on('enter', async (keypadData) => {
            var input = "";
            var keypadelements = document.getElementsByClassName("keypad");
            for(var i = 0; i < keypadelements.length; i++){
              input += keypadelements[i].textContent.trim();
            }
            const bankAccount = document.getElementById('bankAccount').value;
            const pinCode = input;

            const response = await fetch(`http://145.24.223.51:8001/api/balance/${bankAccount}/${pinCode}`);
            const data = await response.json();

            balanceResult.innerText = `Balance: ${data.saldo}`;
        });