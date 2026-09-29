from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
import json
pdfmetrics.registerFont(TTFont('Devanagari','public/fonts/NotoSansDevanagari-Regular.ttf',shapable=True))
mapping=json.load(open('lib/conversion/krutidev.json',encoding='utf-8-sig'))
c=canvas.Canvas('public/keyboard.pdf',pagesize=(842,595))
c.setTitle('Akshar — Kruti Dev 010 keyboard reference')
c.setFillColor(HexColor('#f8faf7'));c.rect(0,0,842,595,fill=1,stroke=0)
c.setFillColor(HexColor('#1d7461'));c.setFont('Helvetica-Bold',28);c.drawString(40,540,'akshar. / Kruti Dev 010')
c.setFillColor(HexColor('#536e5b'));c.setFont('Helvetica',12);c.drawString(40,513,'Remington keyboard reference · Lowercase and Shift key readings')
rows=['1234567890-=','qwertyuiop[]','asdfghjkl;\'','zxcvbnm,./']
for ri,row in enumerate(rows):
 y=401-ri*74
 for col,key in enumerate(row):
  x=40+col*62
  c.setFillColor(HexColor('#ffffff'));c.setStrokeColor(HexColor('#cedacb'));c.roundRect(x,y,56,64,6,fill=1,stroke=1)
  c.setFont('Helvetica',10);c.setFillColor(HexColor('#7d8e78'));c.drawString(x+7,y+49,key.upper())
  def show(k):
   v=mapping.get(k,k).replace('\ue000','ि').replace('\ue001','र्')
   return ('◌'+v) if v and ('\u093a'<=v[0]<='\u094f' or '\u0900'<=v[0]<='\u0903') else v
  c.setFont('Devanagari',17);c.setFillColor(HexColor('#22583f'));c.drawString(x+6,y+17,show(key))
  shifted=dict(zip("1234567890-=[];',./",'!@#$%^&*()_+{}:"<>?')).get(key,key.upper())
  c.setFont('Devanagari',12);c.setFillColor(HexColor('#71836a'));c.drawRightString(x+50,y+37,show(shifted))
c.setFont('Helvetica',10);c.setFillColor(HexColor('#536e5b'))
c.drawString(40,130,'f = pre-base i-matra: type before the consonant. Z = reph: type after the syllable.')
c.drawString(40,111,'Top-right: Shift reading. Numerals use the underlying key code; extended Alt-code glyphs are not shown.')
c.drawString(40,79,'Review combined glyphs in the live typing preview. A dotted circle marks a combining sign.')
c.drawString(40,60,'Original chart for Akshar. No legacy font or third-party keyboard artwork is embedded.')
c.save()

