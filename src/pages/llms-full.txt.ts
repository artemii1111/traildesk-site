import { llmsFull } from '../llms';

export const GET = () => new Response(llmsFull(), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
