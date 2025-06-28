import markdown2
from weasyprint import HTML


def convert_to_pdf(md_string):
    html_body = markdown2.markdown(md_string)

    css = """
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Fira+Sans&display=swap');

    body {
        font-family: 'Fira Sans', sans-serif;
        font-size: 14px;
        line-height: 1.6;
        color: #333;
    }

    h1 {
        color: #2c3e50;
        font-size: 26px;
    }
    </style>
    """

    # Combine CSS and HTML
    full_html = f"<!DOCTYPE html><html><head>{css}</head><body>{html_body}</body></html>"

    # Generate PDF
    HTML(string=full_html).write_pdf("output_pothole.pdf")