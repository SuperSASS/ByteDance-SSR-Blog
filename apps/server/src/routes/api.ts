import Router from '@koa/router';
import { postApiController } from '../controllers/post.api.controller.js';
import { userApiController } from '../controllers/user.api.controller.js';
import { categoryApiController } from '../controllers/category.api.controller.js';
import { tagApiController } from '../controllers/tag.api.controller.js';
import { permissionApiController } from '../controllers/permission.api.controller.js';

const router = new Router({
  prefix: '/api',
});

// Post routes
router.post('/posts', postApiController.createPost);
router.get('/posts', postApiController.getPosts);
router.get('/posts/:id', postApiController.getPost);
router.put('/posts/:id', postApiController.updatePost);
router.delete('/posts/:id', postApiController.deletePost);

// User routes
router.post('/users', userApiController.createUser);
router.get('/users', userApiController.getUsers);
router.get('/users/:id', userApiController.getUser);
router.put('/users/:id', userApiController.updateUser);
router.delete('/users/:id', userApiController.deleteUser);

// Category routes
router.post('/categories', categoryApiController.createCategory);
router.get('/categories', categoryApiController.getCategories);
router.get('/categories/:id', categoryApiController.getCategory);
router.put('/categories/:id', categoryApiController.updateCategory);
router.delete('/categories/:id', categoryApiController.deleteCategory);

// Tag routes
router.post('/tags', tagApiController.createTag);
router.get('/tags', tagApiController.getTags);
router.get('/tags/:id', tagApiController.getTag);
router.put('/tags/:id', tagApiController.updateTag);
router.delete('/tags/:id', tagApiController.deleteTag);

// Permission routes
router.post('/permissions', permissionApiController.grantPermission);
router.delete(
  '/permissions/:userId/:categoryId',
  permissionApiController.revokePermission
);
router.get(
  '/permissions/user/:userId',
  permissionApiController.getUserPermissions
);
router.get(
  '/permissions/category/:categoryId',
  permissionApiController.getCategoryPermissions
);

export default router;
