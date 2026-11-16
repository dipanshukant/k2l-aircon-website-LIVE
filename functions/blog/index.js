import { blogIndex } from '../../lib/blog.js';

export const onRequestGet = (ctx) => blogIndex(ctx, 'en');
