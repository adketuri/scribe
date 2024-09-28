# Scribe

## What is it?

Game dialogue viewer and localization tool for Starless Umbra.

## Quickstart

1. Clone
2. Install dependencies: `yarn`
3. Pull initial game dialogue: `yarn pull` (requires `starlessumbra` project as a sibling for now)
4. Run initial migrations: `yarn db:deploy`
5. Seed the database `yarn db:seed`

## Usage

- Write dialogue as normal in-game.
- Periodically pull with `yarn pull`
- Localize as required with the deployed client

### Exporting

- Go to the `Admin` page
- Download the respective language jsons.
- Drop them in `/starlessumbra/datafiles/db/i18n`
