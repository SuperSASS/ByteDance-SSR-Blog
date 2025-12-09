import Router from '@koa/router';
import { postApiController } from '../controllers/post.api.controller.js';
import { userApiController } from '../controllers/user.api.controller.js';
import { categoryApiController } from '../controllers/category.api.controller.js';
import { tagApiController } from '../controllers/tag.api.controller.js';
import { permissionApiController } from '../controllers/permission.api.controller.js';
import { dashboardController as dashboardApiController } from '../controllers/dashboard.api.controller.js';
import * as authController from '../controllers/auth.api.controller.js';
import { uploadController } from '../controllers/upload.controller.js';
import { upload } from '../middleware/upload.middleware.js';
import {
  requireAuth,
  requireRole,
  requireCategoryPermission,
} from '../middleware/auth.middleware.js';

const router = new Router({
  prefix: '/api',
});

// ==================== 认证路由(无需 token) ====================
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);

// ==================== 需要认证的路由 ====================
router.get('/auth/me', requireAuth, authController.me);

// ==================== 公开的前台 API(无需认证) ====================
// Post routes - 只读接口
router.get('/posts', postApiController.getPosts);
router.get('/posts/:id', postApiController.getPost);
router.get('/posts/category/:categoryId', postApiController.getPostsByCategory);
router.get('/posts/tag/:tagId', postApiController.getPostsByTag);
router.get('/posts/year/:year', postApiController.getPostsByYear);
router.post('/posts/:id/view', postApiController.incrementView);
router.get('/archive/statistics', postApiController.getArchiveStatistics);

// Category routes - 只读接口
router.get('/categories', categoryApiController.getCategories);
router.get('/categories/:id', categoryApiController.getCategory);

// Tag routes - 只读接口
router.get('/tags', tagApiController.getTags);
router.get('/tags/:id', tagApiController.getTag);

// 后台管理 API(需要认证和权限)
// 后台文章管理(需要 ADMIN 或 EDITOR 角色)
router.get(
  '/admin/posts',
  requireAuth,
  requireRole('ADMIN', 'EDITOR'),
  postApiController.getAdminPosts // Assuming this method exists in controller
);
router.post(
  '/posts',
  requireAuth,
  requireRole('ADMIN', 'EDITOR'),
  requireCategoryPermission('body.categoryId'),
  postApiController.createPost
);
router.put(
  '/posts/:id',
  requireAuth,
  requireRole('ADMIN', 'EDITOR'),
  // TODO: 需要检查文章所属分类的权限
  postApiController.updatePost
);
router.delete(
  '/posts/:id',
  requireAuth,
  requireRole('ADMIN', 'EDITOR'),
  // TODO: 需要检查文章所属分类的权限
  postApiController.deletePost
);

// 后台用户管理(仅 ADMIN)
router.post(
  '/users',
  requireAuth,
  requireRole('ADMIN'),
  userApiController.createUser
);
router.get(
  '/users',
  requireAuth,
  requireRole('ADMIN'),
  userApiController.getUsers
);
router.get(
  '/users/:id',
  requireAuth,
  requireRole('ADMIN'),
  userApiController.getUser
);
router.put(
  '/users/:id',
  requireAuth,
  requireRole('ADMIN'),
  userApiController.updateUser
);
router.delete(
  '/users/:id',
  requireAuth,
  requireRole('ADMIN'),
  userApiController.deleteUser
);

// 后台分类管理(仅 ADMIN)
router.post(
  '/categories',
  requireAuth,
  requireRole('ADMIN'),
  categoryApiController.createCategory
);
router.put(
  '/categories/:id',
  requireAuth,
  requireRole('ADMIN'),
  categoryApiController.updateCategory
);
router.delete(
  '/categories/:id',
  requireAuth,
  requireRole('ADMIN'),
  categoryApiController.deleteCategory
);

// 后台标签管理(仅 ADMIN)
router.post(
  '/tags',
  requireAuth,
  requireRole('ADMIN'),
  tagApiController.createTag
);
router.put(
  '/tags/:id',
  requireAuth,
  requireRole('ADMIN'),
  tagApiController.updateTag
);
router.delete(
  '/tags/:id',
  requireAuth,
  requireRole('ADMIN'),
  tagApiController.deleteTag
);

// 后台权限管理(仅 ADMIN)
router.post(
  '/permissions',
  requireAuth,
  requireRole('ADMIN'),
  permissionApiController.grantPermission
);
router.delete(
  '/permissions/:userId/:categoryId',
  requireAuth,
  requireRole('ADMIN'),
  permissionApiController.revokePermission
);
router.get(
  '/permissions/user/:userId',
  requireAuth,
  requireRole('ADMIN'),
  permissionApiController.getUserPermissions
);
router.get(
  '/permissions/category/:categoryId',
  requireAuth,
  requireRole('ADMIN'),
  permissionApiController.getCategoryPermissions
);

// Dashboard routes
router.get(
  '/dashboard/stats',
  requireAuth,
  requireRole('ADMIN', 'EDITOR'),
  dashboardApiController.getStats
);
router.get(
  '/dashboard/permissions',
  requireAuth,
  dashboardApiController.getPermissions
);

// Upload routes (需要 ADMIN 或 EDITOR 权限)
router.post(
  '/upload/image',
  requireAuth,
  requireRole('ADMIN', 'EDITOR'),
  upload.single('image'),
  uploadController.uploadImage
);

export default router;
