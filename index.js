#!/usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import { faker } from "@faker-js/faker";
// OOP_MYBANK 
// create class for customer
class Customer {
    firstName;
    lastName;
    age;
    gender;
    mobileNo;
    accountNo;
    constructor(fName, lName, age, gender, mobNo, accNo) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.mobileNo = mobNo;
        this.accountNo = accNo;
    }
}
// create class for bank
class Bank {
    customer = [];
    account = [];
    customerAdd(obj) {
        this.customer.push(obj);
    }
    accountNoAdd(obj) {
        this.account.push(obj);
    }
    updateTransaction(accountObj) {
        let updateAcc = this.account.filter((acc) => acc.accountNo !== accountObj.accountNo);
        this.account = [...updateAcc, accountObj];
    }
}
console.log(chalk.bold.yellow(">>>>>>>>>>>>>>>>>-------------------------------<<<<<<<<<<<<<<<<"));
console.log(chalk.bold.cyanBright("\n~~~~~~~~~~~***********| WELCOME TO MY BANK |***********~~~~~~~~~~~~\n"));
console.log(chalk.bold.yellow(">>>>>>>>>>>>>>>>>-------------------------------<<<<<<<<<<<<<<<<"));
let myBank = new Bank();
// create customer
// create for loop
for (let i = 1; i <= 4; i++) {
    let fName = faker.person.firstName("male");
    let lName = faker.person.lastName();
    let mobNo = parseInt(faker.string.numeric("3##########"));
    const cus = new Customer(fName, lName, 18 * i, "male", mobNo, 4000 + i);
    myBank.customerAdd(cus);
    myBank.accountNoAdd({ accountNo: cus.accountNo, balance: 1000 * i });
}
// create bank functionallity
async function bankService(bank) {
    do {
        let services = await inquirer.prompt({
            name: "select",
            type: "list",
            message: chalk.bold.cyan("\nPlease select the service?\n"),
            choices: [
                chalk.bold.green("View Balance"),
                chalk.bold.grey("Cash Withdraw"),
                chalk.bold.magenta("Cash Deposit"),
                chalk.bold.red("Exit"),
            ],
        });
        // condition for view balance
        if (services.select == chalk.bold.green("View Balance")) {
            let response = await inquirer.prompt({
                name: "AccNo",
                type: "input",
                message: chalk.bold.yellow("\nPlease enter your Account No:"),
            });
            let account = myBank.account.find((acc) => acc.accountNo == response.AccNo);
            if (!account) {
                console.log(chalk.red.bold("\nInvalid Account No!\n"));
            }
            if (account) {
                let name = myBank.customer.find((item) => item.accountNo == account?.accountNo);
                console.log(chalk.bold.cyan(`\nDear ${chalk.green.italic(name?.firstName)} ${chalk.green.italic(name?.lastName)} your Account Balance is ${chalk.bold.green(`$${account.balance}`)}\n`));
            }
        }
        // condition for cash withdraw
        if (services.select == chalk.bold.gray("Cash Withdraw")) {
            let response = await inquirer.prompt({
                name: "AccNo",
                type: "input",
                message: chalk.bold.yellow("\nPlease enter your Account No:"),
            });
            let account = myBank.account.find((acc) => acc.accountNo == response.AccNo);
            if (!account) {
                console.log(chalk.red.bold("\nInvalid Account No!\n"));
            }
            if (account) {
                let answer = await inquirer.prompt({
                    name: "dollar",
                    type: "number",
                    message: chalk.bold.green("\nPlease enter your Amount"),
                });
                if (answer.dollar > account.balance) {
                    console.log(chalk.bold.red("\nInsufficient Balance!\n"));
                }
                else {
                    console.log(chalk.bold.cyan(`\nYour Cash "$${chalk.bold.green(answer.dollar)}" Withdraw Successfully...\n`));
                }
                let newBalance = account.balance - answer.dollar;
                // update transaction method call
                bank.updateTransaction({
                    accountNo: account.accountNo,
                    balance: newBalance,
                });
            }
        }
        // condition for cash deposit
        if (services.select == chalk.bold.magenta("Cash Deposit")) {
            let response = await inquirer.prompt({
                name: "AccNo",
                type: "input",
                message: chalk.bold.yellow("\nPlease enter your Account No:"),
            });
            let account = myBank.account.find((acc) => acc.accountNo == response.AccNo);
            if (!account) {
                console.log(chalk.red.bold("\nInvalid Account No!\n"));
            }
            if (account) {
                let answer = await inquirer.prompt({
                    name: "dollar",
                    type: "number",
                    message: chalk.bold.green("\nPlease enter your Amount"),
                });
                let newBalance = account.balance + answer.dollar;
                // update transaction method call
                bank.updateTransaction({
                    accountNo: account.accountNo,
                    balance: newBalance,
                });
                console.log(chalk.bold.cyan(`\nYour Cash "$${chalk.bold.green(answer.dollar)}" Deposit Successfully...\n`));
            }
        }
        if (services.select == chalk.bold.red("Exit")) {
            console.log(chalk.bold.green("\n>>>>>>>--------ALWAYS CHOOSE MY BANK--------<<<<<<<\n"));
            process.exit();
        }
    } while (true);
}
bankService(myBank);
