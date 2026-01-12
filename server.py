from flask import Flask, request, send_file, render_template
from pptx import Presentation
from pptx.util import Inches, Pt
from io import BytesIO
import requests
from pptx.dml.color import RGBColor

app = Flask(__name__)

def fetch_image_into_memory(url):
    try:
        # AUTOMATIC FIX: Convert GitHub "blob" (HTML page) URL to "raw" (Image) URL
        if "github.com" in url and "/blob/" in url:
            url = url.replace("/blob/", "/raw/")
        
        print(f"Fetching image from: {url}")
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return BytesIO(response.content)
    except Exception as e:
        print(f"Error downloading image: {e}")
        return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload-and-design', methods=['POST'])
def upload_and_design():
    if 'pptFile' not in request.files:
        return "No file part", 400

    file = request.files['pptFile']
    
    # --- NEW: Get the Design URL from the form ---
    # We use .get() to avoid errors if the field is missing
    design_url = request.form.get('design_url') 
    
    # Fallback: If user didn't select a design, use a default one
    if not design_url:
        design_url = "https://github.com/anusin1805/DesignPPTX/blob/main/gender%20graph%20difference.png"

    if file:
        try:
            prs = Presentation(file)
            
            # Fetch the selected image
            image_stream = fetch_image_into_memory(design_url)
            
            if not image_stream:
                return "Error: Could not retrieve the selected design image.", 500

            # Iterate through slides and add the image
            for slide in prs.slides:
                # Reset stream to start for every slide
                image_stream.seek(0)
                
                # Position logic (Bottom Right Corner example)
                left = Inches(7.5)
                top = Inches(5.5)
                width = Inches(2) # Adjust size as needed

                try:
                    slide.shapes.add_picture(image_stream, left, top, width=width)
                except Exception as e:
                    print(f"Could not add picture to a slide: {e}")

            output_pptx = BytesIO()
            prs.save(output_pptx)
            output_pptx.seek(0)

            return send_file(
                output_pptx,
                mimetype='application/vnd.openxmlformats-officedocument.presentationml.presentation',
                as_attachment=True,
                download_name='designed_presentation.pptx'
            )

        except Exception as e:
            return f"Error processing file: {str(e)}", 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
