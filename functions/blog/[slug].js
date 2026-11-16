import { blogPost } from '../../lib/blog.js';

export const onRequestGet = (ctx) => blogPost(ctx, 'en');
