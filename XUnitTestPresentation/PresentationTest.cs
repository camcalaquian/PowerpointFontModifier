using PPTModifier.Utilities;
using Spire.Presentation;
using Spire.Presentation.Charts;
using Spire.Presentation.Diagrams;
using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using Xunit;

namespace XUnitTestPresentation
{
    public class PresentationTest
    {
        [Fact]
        public void TestAutoShapeFonts()
        {
            string fontName = "Arial";
            float fontSize = 16.5f;

            //Load update and save the file 
            using (var presentation = new Presentation())
            {
                presentation.LoadFromFile("../../../TestFiles/TestFile - Assorted.pptx");
                PowerPointFontUtility.UpdateAllFontStyle(presentation, fontName, fontSize);
                presentation.SaveToFile("../../../OutputFile/OutputFile - Assorted.pptx", FileFormat.Auto);
            }

            //Load the processed file and inspect for the values
            using (var presentation = new Presentation())
            {
                presentation.LoadFromFile("../../../OutputFile/OutputFile - Assorted.pptx");
                foreach (ISlide slide in presentation.Slides)
                {
                    if (slide.Shapes != null)
                    {
                        foreach (var shape in slide.Shapes)
                        {
                            switch (shape)
                            {
                                case IAutoShape autoShape:
                                    if (autoShape?.TextFrame != null)
                                    {
                                        TextFrameAssert(autoShape?.TextFrame, fontName, fontSize);
                                    }
                                    break;
                                case ISmartArt smartArt:
                                    if (smartArt.Nodes != null)
                                    {
                                        foreach (ISmartArtNode node in smartArt.Nodes)
                                        {
                                            RecursiveNodeAssertion(node, fontName, fontSize);
                                        }
                                    }
                                    break;
                                case IChart chart:
                                    ChartAssert(chart, fontName, fontSize);
                                    break;
                            }
                        }
                    }
                }
            }
        }
        private void TextFrameAssert(ITextFrameProperties textFrame, string fontName, float fontSize)
        {
            if (textFrame.Paragraphs != null)
                foreach (TextParagraph paragraph in textFrame.Paragraphs)
                {
                    if (paragraph.TextRanges != null)
                    {
                        foreach (TextRange text in paragraph.TextRanges)
                        {
                            if (text.LatinFont != null)
                            {
                                Assert.Equal(fontName, text.LatinFont.FontName);
                            }
                            if (!float.IsNaN(text.FontHeight))
                            {
                                Assert.Equal(fontSize, text.FontHeight);
                            }
                        }
                    }
                }
        }

        private void RecursiveNodeAssertion(ISmartArtNode node, string fontName, float fontSize)
        {
            if(node.TextFrame != null)
            {
                TextFrameAssert(node.TextFrame, fontName, fontSize);
            }

            if(node.ChildNodes != null)
            {
                foreach(ISmartArtNode childNode in node.ChildNodes)
                {
                    RecursiveNodeAssertion(childNode, fontName, fontSize);
                }
            }
        }

        private void ChartAssert(IChart chart, string fontName, float fontSize)
        {
            ChartAxisAssert(chart.PrimaryCategoryAxis, fontName, fontSize);
            ChartAxisAssert(chart.PrimaryValueAxis, fontName, fontSize);
            ChartAxisAssert(chart.SecondaryCategoryAxis, fontName, fontSize);
            ChartAxisAssert(chart.SecondaryValueAxis, fontName, fontSize);
                                  
            if(chart?.ChartDataTable?.Text != null)
            {
                TextFrameAssert(chart.ChartDataTable.Text, fontName, fontSize);
            }

            if (chart?.ChartTitle != null)
            {
                TextFrameAssert(chart.ChartTitle.TextProperties, fontName, fontSize);
            }

            foreach (ChartSeriesDataFormat seriesDataFormat in chart.Series)
            {
                if(seriesDataFormat?.DataLabels?.TextProperties != null)
                {
                    TextFrameAssert(seriesDataFormat.DataLabels.TextProperties, fontName, fontSize);
                }
                
            }
        }

        private void ChartAxisAssert(IChartAxis chartAxis, string fontName, float fontSize)
        {
            if (chartAxis?.TextProperties != null)
            {
                TextFrameAssert(chartAxis.TextProperties, fontName, fontSize);
            }
            if(chartAxis?.Title?.TextProperties != null)
            {
                TextFrameAssert(chartAxis.Title.TextProperties, fontName, fontSize);
            }
        }
    }
}
