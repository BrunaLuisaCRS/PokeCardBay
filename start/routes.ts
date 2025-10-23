/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'

const users = [
    { id: 1, name: 'John Doe', age: 30 },
    { id: 2, name: 'Jane Doe', age: 25 },
]

router.get('/users/', async () => {
    return users
})

router.get('/users/:id', async ({ response, params }: HttpContext) => {
    const userId = Number(params.id)

    for (const user of users) {
        if (user.id === userId) {
            return user
        }
    }

    return response.status(404).send({
     message: 'User not found' })
})

router.post('/users', ({ request }: HttpContext) => {
    console.log(request.body())
    return users
})