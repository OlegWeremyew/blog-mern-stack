import PostModel from '../models/post-model.js'

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec()

    res.status(200).json(posts)

  } catch (err) {
    console.log(err)

    res.status(500).json({
      message: 'Не удалось получить статьи',
    })
  }
}

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec()

    const tags = posts.map((post) => post.tags).flat().slice(0, 5)

    res.json(tags)

  } catch (err) {
    console.log(err)

    res.status(500).json({
      message: 'Не удалось получить теги',
    })
  }
}

export const getOne = async (req, res) => {
  try {
    const postID = req.params.id
    await PostModel.findOneAndUpdate(
        {
          _id: postID,
        }, {
          $inc: {viewsCount: 1},
        }, {
          returnDocument: 'after',
          populate: 'user'
        }
      )
      .then((doc) => {
          if (!doc) {
            return res.status(404).json({
              message: 'Статья не найдена'
            })
          }

          res.status(200).json(doc)
        }
      )
      .catch((err) => {
        console.log(err)
        return res.status(500).json({
          message: 'Не удалось вернуть статью',
        })
      })
  } catch (err) {
    console.log(err)

    res.status(500).json({
      message: 'Не удалось получить статьи',
    })
  }
}

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags.split(','),
      imageUrl: req.body.imageUrl,
      user: req.userID
    })

    const post = await doc.save()

    res.status(201).json(post)

  } catch (err) {
    console.log(err)

    res.status(500).json({
      message: 'Не удалось создать статью',
    })
  }
}

export const update = async (req, res) => {
  try {
    const postID = req.params.id

    await PostModel.updateOne(
      {
        _id: postID,
      },
      {
        title: req.body.title,
        description: req.body.description,
        tags: req.body.tags,
        imageUrl: req.body.imageUrl,
        user: req.userID
      })

    res.status(200).json({
      success: true,
    })
  } catch (err) {
    console.log(err)

    res.status(500).json({
      message: 'Не удалось обновить статью',
    })
  }
}

export const remove = async (req, res) => {
  try {
    const postID = req.params.id

    await PostModel.findOneAndDelete({_id: postID})
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена'
          })
        }

        res.status(200).json({
          success: true
        })
      })
      .catch((err) => {
        console.log(err)
        return res.status(500).json({
          message: 'Не удалось удалить статью',
        })
      })

  } catch (err) {
    console.log(err)

    res.status(500).json({
      message: 'Не удалось получить статьи',
    })
  }
}