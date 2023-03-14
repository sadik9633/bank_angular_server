const jwt = require("jsonwebtoken")
// import the dbs file 
const db = require('./db.js')
//userDetails={
//   1000:{acno:1000,username:"anu",password:"abc123",balance:0,transaction:[]},
//   1001:{acno:1001,username:"amal",password:"abc123",balance:0,transaction:[]},
//   1003:{acno:1003,username:"arun",password:"abc123",balance:0,transaction:[]},
//  1004:{acno:1004,username:"akil",password:"123abc",balance:0,transaction:[]}
//}




register = (uname, acno, psw) => {
  //if(acno in userDetails){
  return db.User.findOne({ acno }).then(user => {
    if (user) {
      return {
        status: false,
        message: 'user alredy present',
        statusCode: 401
      }
    }
    else {
      // create new user object in db
      const newuser = new db.User({
        acno,
        username: uname,
        password: psw,
        balance: 0,
        transaction: []
      })
      //save in db
      newuser.save()
      return {
        status: true,
        message: 'registered',
        statusCode: 200
      }
    }
  })

}



login = (acno, psw) => {
  //if (acno in userDetails) {
  return db.User.findOne({ acno, password: psw }).then(user => {
    if (user) {
      currentUser = user.username
      //console.log(this.currentUser);
      currentAcno = acno

      //token generation
      const token = jwt.sign({ currentAcno }, "superkey123"
      )


      return {
        status: true,
        message: 'login success',
        statusCode: 200,
        currentUser,
        currentAcno,
        token
      }
    }
    else {
      return {
        status: false,
        message: 'incurrect account number or password',
        statusCode: 401
      }
    }
  })
}

deposit = (acnum, password, amount) => {
  //convert string amount to number
  var amnt = parseInt(amount)
  return db.User.findOne({ acno: acnum, password, }).then(user => {
    if (user) {
      user.balance += amnt
      user.transaction.push({ Type: "CREDIT", amount: amnt })
      //currentBalance=user.balance;
      user.save()
      //return current balance
      return {
        status: true,
        message: `${amnt} is credited in your account and the balance is ${user.balance//currentBalance
        }`,
        statusCode: 200
      }
    }
    else {
      return {
        status: false,
        message: 'incurrect account number or password',
        statusCode: 401
      }

    }
  })
}

withdraw = (acnum, password, amount) => {
  //convert string amount to number
  var amnt = parseInt(amount)
  return db.User.findOne({ acno: acnum, password }).then(user => {
    if (user) {
      if (amnt <= user.balance) {
        user.balance -= amnt
        user.transaction.push({ Type: "DEBIT", amount: amnt })

        user.save()
        //return current balance
        return {
          status: true,
          message: `${amnt} is debited in your account and the balance is ${user.balance}`,
          statusCode: 200
        }

      }
      else {

        return {
          status: false,
          message: 'insufficent balance',
          statusCode: 401
        }
      }
    }

    else {
      return {
        status: false,
        message: 'incurrect account number or password',
        statusCode: 401
      }
    }
  })
}
getTransaction = (acno) => {
  return db.User.findOne({acno}).then(user=>{
    if(user){
      return {
        status: true,
        statusCode: 200,
        transaction:user.transaction
      }
    }
  })
}
deleteAc=(acno)=>{
  return db.User.deleteOne({acno}).then(user=>{
    if(user){
      return{
        status: true,
        statusCode: 200,
        message:'account deleted'
      }
    }
    
  })
}
//to export function
module.exports = {
  register, login, deposit, withdraw, getTransaction,deleteAc
}
