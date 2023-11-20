# import re

# html_pattern = "<(?:\"[^\"]*\"['\"]*|'[^']*'['\"]*|[^'\">])+>"

content = "<!DOCTYPE html>\r\n<html>\r\n<head>\r\n</head>\r\n<body style=\"max-width:600px;margin:auto;border:1px solid #f2f2f2;border-radius:8px;padding:10px;\">\r\n<p>Hi Shobhit,</p>\r\n<div>\r\n<p><strong>Myntra</strong> is currently looking for <strong>Data Analyst</strong><strong>&nbsp;</strong>who will monitor key metrics such as revenue per unit, gross margin, provisioning liquidation, conversion, average order value, customer acquisition, top-performing styles, etc</p>\r\n<p>They will work with the analytics team to measure the effectiveness of marketing campaigns to evaluate and improve future performance.</p>\r\n<div>\r\n<div><strong>Salary</strong>:- INR 12 Lakhs (via glassdoor)</div>\r\n<p style=\"text-align: center; max-width: 700px; margin: 20px 0;\"><strong><a style=\"background: #176ede; color: #fff; padding: 10px 20px; border-radius: 4px; text-decoration: none;\" href=\"https://unstop.com/jobs/data-analyst-myntra-822449?utm_source=Jobs&amp;utm_medium=D2C-Newsletters&amp;utm_campaign=Eng-4th-Year\">Apply Now</a></strong></p>\r\n</div>\r\n</div>\r\n<div>\r\n<p>Regards,<br />Team Unstop&nbsp;</p>\r\n</div>\r\n</body>\r\n<p style=\"text-align: center;\"><a href=\"https://unstop.com/newsletter-unsubscribe/c2hvYmhpdG1pc2hyYTIwMDJAZ21haWwuY29t\"  style=\"font-size: 8px;\">Unsubscribe here</a></p>\r\n</html>\r\n"

# output = re.sub(html_pattern, '', content) 
# print(output)

from bs4 import BeautifulSoup
import requests  # You may need to install the requests library: pip install requests

def extract_plain_text(html_content):
    # Parse the HTML content
    soup = BeautifulSoup(html_content, 'html.parser')

    # Extract plain text
    plain_text = soup.get_text(separator=' ', strip=True)
    
    return plain_text

output = extract_plain_text(content)
print(output)

# Example usage:
# url = 'https://example.com'  # Replace with the URL of the HTML page or provide your HTML content
# response = requests.get(url)

# if response.status_code == 200:
#     html_content = response.text
#     extracted_text = extract_plain_text(html_content)
#     print(extracted_text)
# else:
#     print(f"Error accessing the URL. Status code: {response.status_code}")
