import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

if (!webhookSecret) {
  throw new Error('Please add CLERK_WEBHOOK_SECRET to your environment variables');
}

export async function POST(req: NextRequest) {
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(webhookSecret);

  let evt: any;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as any;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;
  console.log('Clerk webhook event:', eventType);

  switch (eventType) {
    case 'user.created':
      try {
        await db.insert(users).values({
          id: evt.data.id,
          email: evt.data.email_addresses[0]?.email_address || '',
          firstName: evt.data.first_name || null,
          lastName: evt.data.last_name || null,
          imageUrl: evt.data.image_url || null,
        });
        console.log('User created:', evt.data.id);
      } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
      }
      break;

    case 'user.updated':
      try {
        await db
          .update(users)
          .set({
            email: evt.data.email_addresses[0]?.email_address || '',
            firstName: evt.data.first_name || null,
            lastName: evt.data.last_name || null,
            imageUrl: evt.data.image_url || null,
            updatedAt: new Date(),
          })
          .where(eq(users.id, evt.data.id));
        console.log('User updated:', evt.data.id);
      } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
      }
      break;

    case 'user.deleted':
      try {
        await db.delete(users).where(eq(users.id, evt.data.id));
        console.log('User deleted:', evt.data.id);
      } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
      }
      break;

    default:
      console.log('Unhandled webhook event:', eventType);
  }

  return NextResponse.json({ status: 'success' });
} 