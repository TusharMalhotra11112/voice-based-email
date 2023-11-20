import re

html_pattern = "<(?:\"[^\"]*\"['\"]*|'[^']*'['\"]*|[^'\">])+>"

content = "<!DOCTYPE html>\r\n<html>\r\n<head>\r\n</head>\r\n<body style=\"max-width:600px;margin:auto;border:1px solid #f2f2f2;border-radius:8px;padding:10px;\">\r\n<p>Hi Shobhit,</p>\r\n<div>\r\n<p><strong>Myntra</strong> is currently looking for <strong>Data Analyst</strong><strong>&nbsp;</strong>who will monitor key metrics such as revenue per unit, gross margin, provisioning liquidation, conversion, average order value, customer acquisition, top-performing styles, etc</p>\r\n<p>They will work with the analytics team to measure the effectiveness of marketing campaigns to evaluate and improve future performance.</p>\r\n<div>\r\n<div><strong>Salary</strong>:- INR 12 Lakhs (via glassdoor)</div>\r\n<p style=\"text-align: center; max-width: 700px; margin: 20px 0;\"><strong><a style=\"background: #176ede; color: #fff; padding: 10px 20px; border-radius: 4px; text-decoration: none;\" href=\"https://unstop.com/jobs/data-analyst-myntra-822449?utm_source=Jobs&amp;utm_medium=D2C-Newsletters&amp;utm_campaign=Eng-4th-Year\">Apply Now</a></strong></p>\r\n</div>\r\n</div>\r\n<div>\r\n<p>Regards,<br />Team Unstop&nbsp;</p>\r\n</div>\r\n</body>\r\n<p style=\"text-align: center;\"><a href=\"https://unstop.com/newsletter-unsubscribe/c2hvYmhpdG1pc2hyYTIwMDJAZ21haWwuY29t\"  style=\"font-size: 8px;\">Unsubscribe here</a></p>\r\n</html>\r\n"

output = re.sub(html_pattern, '', content) 
print(output)