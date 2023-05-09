import bcrypt from "bcrypt";
import UserModel from "../models/user-model.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const password = req.body.password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const doc = new UserModel({
      email: req.body.email,
      passwordHash: hash,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
    })

    const user = await doc.save()

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      },
    )

    const {passwordHash, ...userDate} = user._doc

    res.status(201).json({
      userDate,
      token,
    })
  } catch (err) {
    console.log(err)

    res.status(500).json({
      message: 'Не удалось зарегестрироваться',
    })
  }
}

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({email: req.body.email})

    if (!user) {
      return res.status(400).json({
        message: 'User didn\'t find'
      })
    }

    const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash)

    if (!isValidPassword) {
      return res.status(400).json({
        message: 'Incorrect login or password'
      })
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      },
    )

    const {passwordHash, ...userDate} = user._doc

    res.status(200).json({
      userDate,
      token,
    })

  } catch (err) {
    console.log(err)

    res.status(500).json({
      message: 'Не удалось авторизоваться',
    })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userID)

    if (!user) {
      return res.status(404).json({
        message: 'User didn\'t find',
      })
    }

    const {passwordHash, ...userDate} = user._doc

    res.status(200).json(userDate)
  } catch (err) {
    console.log(err)
    res.status(404).json({
      message: "No Access"
    })
  }
}