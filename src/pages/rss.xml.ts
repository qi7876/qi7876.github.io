import { generateRSS } from '@/utils/feed'

export async function GET() {
  return generateRSS()
}
