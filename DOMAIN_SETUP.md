# Setting Up Custom Domain: playitloud.com

## Step 1: Add Domain in Vercel Dashboard

1. Go to: https://vercel.com/olaropetercelestines-projects/playitloud/settings/domains
2. Click **"Add Domain"**
3. Enter: `playitloud.com`
4. Click **"Add"**

## Step 2: Configure DNS Records

Vercel will provide you with DNS records to add at your domain registrar. Typically you'll need:

### Option A: Root Domain (playitloud.com)
- **Type:** A record
- **Name:** @ (or root)
- **Value:** Vercel will provide IP addresses (usually 76.76.21.21 or similar)
- **TTL:** 3600 (or default)

### Option B: CNAME (Recommended)
- **Type:** CNAME
- **Name:** @ (or root)
- **Value:** `cname.vercel-dns.com`
- **TTL:** 3600 (or default)

### For www subdomain (playitloud.com/www.playitloud.com)
- **Type:** CNAME
- **Name:** www
- **Value:** `cname.vercel-dns.com`
- **TTL:** 3600 (or default)

## Step 3: Add Domain via Vercel CLI (Alternative)

If you prefer command line:

```bash
vercel domains add playitloud.com
```

Then follow the DNS configuration instructions it provides.

## Step 4: Verify DNS

After adding DNS records:

1. Wait 5-10 minutes for DNS propagation
2. Vercel will automatically verify the domain
3. Check status at: https://vercel.com/olaropetercelestines-projects/playitloud/settings/domains

## Step 5: SSL Certificate

Vercel automatically provisions SSL certificates for your domain. This usually takes a few minutes after DNS verification.

## Troubleshooting

- **DNS not working?** Check that records are correct at your registrar
- **SSL not ready?** Wait a few more minutes - Vercel auto-provisions SSL
- **Domain not verified?** Double-check DNS records match Vercel's instructions exactly

## Current Status

Your app is currently accessible at:
- https://playitloud.vercel.app (auto-generated)
- After setup: https://playitloud.com

