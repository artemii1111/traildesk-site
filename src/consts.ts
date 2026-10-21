export const SITE = 'https://traildesk.space';
export const REPO = 'https://github.com/artemii1111/traildesk';
export const DOCS = `${REPO}/blob/main/docs/install.md`;
export const DISCUSSIONS = `${REPO}/discussions`;
export const RELEASES = `${REPO}/releases`;
export const IMAGE = 'ghcr.io/artemii1111/traildesk';
export const VERSION = '0.2.0';

// The install commands — the same as in docs/install.md.
export const INSTALL = [
  'mkdir traildesk && cd traildesk\n' +
    'curl -fsSLO https://raw.githubusercontent.com/artemii1111/traildesk/main/docker-compose.yml\n' +
    'curl -fsSL https://raw.githubusercontent.com/artemii1111/traildesk/main/.env.example -o .env',
  'nano .env    # SECRET_KEY, TRAILDESK_ENCRYPTION_KEY, POSTGRES_PASSWORD, TRAILDESK_DOMAIN',
  'docker compose --profile https up -d',
  'docker compose exec web python manage.py traildesk_setup --code',
];
