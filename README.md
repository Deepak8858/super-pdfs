# AI PDF SaaS Platform

This is a Next.js application that allows users to upload PDFs and interact with them using AI.

## Features

- User authentication (login, signup)
- PDF upload
- PDF summarization
- Chat with PDF
- Automatic highlighting of important topics
- Sentiment analysis
- Cross-document analysis
- Knowledge base construction
- Dynamic document generation
- Interactive document experiences

## Getting Started

First, you need to create a Supabase project and a Google AI project.

### Supabase Setup

1. Go to [Supabase](https://supabase.com/) and create a new project.
2. In your project, go to the "Storage" section and create a new bucket named `pdfs`.
3. In your project, go to the "SQL Editor" and run the following query to create the `knowledge_base` table:

```sql
CREATE TABLE knowledge_base (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid,
  key text,
  value text
);
```

### Google AI Setup

1. Go to [Google AI Studio](https://aistudio.google.com/) and create a new API key.

### Project Setup

1. Clone the repository.
2. Install the dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root of the project and add the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
