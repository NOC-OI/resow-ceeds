# CEEDS Tool documentation repository

This project represents the documentation for the CEEDS Toool

It was assembled based on the mkdocs package.

## Installation

1. Create a Python 3 virtual environment and activate it:

   ```bash
   pyenv virtualenv ceeds-docs
   ```

2. Install it:

   ```bash
   cd docs
   pyenv local ceeds-docs
   pip install -r requirements.txt
   ```

## Running the Server Locally

If the configuration was done correctly, you can run the following command to launch the documentation:

```bash
mkdocs serve
```

This will run the app in development mode. Open [http://localhost:8000](http://localhost:8000) in your browser to access it. The page will automatically reload when you make edits.

## Information about MkDocs

The central file of the documentation is `docs/index.md`.

All images should be stored in the `docs/assets` folder.

MkDocs uses Markdown language. Therefore, you can easily import your README files from GitHub/GitLab to include in the documentation.

In the `mkdocs.yml` file, you can define the main navigation bar of your project. For example, below, I am indicating that only `index.md` and `about.md` will be present in the navbar:

```yaml
nav:
  - 'index.md'
  - 'about.md'
```

If you do not include the `nav` option, all your .md files in the `docs` folder will be items in your navbar.
