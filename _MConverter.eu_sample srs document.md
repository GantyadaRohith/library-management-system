> **1. INTRODUCTION**

There are many Currencies all over the world, with each of them looking
totally different. For instance the size of the paper is different, the
same as the color and pattern. The staffs who work for the money
exchanging (e.g. Forex Bank) have to distinguish different types of
currencies and that is not an easy job. They have to remember the symbol
of each currency. This may cause some problems (e.g. wrong recognition),
so they need an efficient and exact system to help their work. As we
mentioned before, the aim of our system is to help people who need to
recognize different currencies, and work with convenience and
efficiency. For bank staffs, there is a "Currency Sorting Machine" helps
them to recognize different kinds of currencies. The main working
processes of "Currency Sorting Machine" are image acquisition and
recognitions. It is a technique named "optical, mechanical and
electronic integration", integrated with calculation, pattern
recognition (high speed image processing), currency anti-fake
technology, and lots of multidisciplinary techniques. It is accurate and
highly-efficient. But for most staffs, they have to keep a lot of
different characteristics and anti-fakes label for different
commonly-used currencies in their mind. However, each of them has a
handbook that about the characteristics and anti-fakes labels of some
less commonly-used currencies. Even for that, no one can ever be 100 per
cent confident about the manual recognition. Otherwise our system is
based on image processing, techniques which include filtering, edge
detection, segmentation, etc. In order to make the system more
comprehensive, we need to create a small database for storing the
characteristics of the currency.

In our system, we scan the images of each Currency note and then detect
the some of the important features or key features of a Currency note
using SIFT (Scale Invariant Feature Extraction) Algorithm and we store
the images in the data base and we train our system with the respective
key features and the correlation values of each note. Now the testing
sample image comes into picture and the comparison between the original
images stored in the database and sample scanned image is done.The
comparison is done between the features and correlation values of
trained set and new sample images. This is done using Radial Basis
Networks which consists of three layers. Input layer, Hidden Layer and
Output layer.

Then the results are displayed accordingly. If the note is matched, it
displays the matched note else no match of the note is displayed. The
classification of images is done only on JPEG images only.

> **2. LITERATURE SURVEY**

**2.1 Definition of image**

Data representing a two-dimensional scene. A digital image is composed
of pixels arranged in a rectangular array with a certain height and
width.  Each pixel may consist of one or more bits of information,
representing the brightness of the image at that point and possibly
including color information encoded as RGB triples.

Picture a visual representation (of an object or scene or person or
abstraction) produced on a surface, \"they showed us the pictures of
their wedding\" a movie is a series of images projected so rapidly that
the eye integrates them.

Effective indexing and retrieving desired image in large image database
in the basis of features such as color, text and shape that can be
automatically extracted from the images themselves.

**2.2 Image processing**

The analysis of a picture using techniques that can identify shades,
colors and relationships that cannot be perceived by the human eye.
Image processing is used to solve identification problems, such as in
forensic medicine or in creating weather maps from satellite pictures.
It deals with images in bitmapped graphics format that have been scanned
in or captured with digital cameras.Any image improvement, such as
refining a picture in a paint program that has been scanned or entered
from a video source.

**2.3 Image Retrieval and Information Retrieval**

Since the 1970s Image Retrieval has become a very active research topic,
with two major research communities, database management and computer
vision. One is text-based and another is visual-based. Text-based image
retrieval has become very popular since 1970s, which involves annotating
the image with keywords, and use text-based database management systems
(DBMS) to retrieve the images. In text-based image retrieval system,
keywords of semantic information are attached to the images.

They can be typed manually or by extracting the captions of the images.
It is very efficient for simple and small image databases, since the
whole database can be described by just few hundreds of keywords. But in
the 1990s, several large leaps in development of processor, memory and
storage made the size of image databases grow dramatically. As the image
database and image size grow, there will be more images having different
contents and the images having rich contents cannot be described by only
several Semantic keywords. The demand of labor on annotating the images
also rises dramatically.

Retrieval image providing effective and efficient tool querying large
image database. Information retrieval provides the textual
representation of images. It requires the text descriptions to the
respective images.

Recent technology development in various fields has made large digital
image databases practical. Well organized database and efficient
browsing, storing, and retrieval algorithms are very important in such
systems. Image retrieval techniques were developed to aid these
components.

Image Retrieval was originated from Information Retrieval, which has
been very active research topic since 1940s. "We have huge amounts of
information to which accurate and speedy access is becoming ever more
difficult." In principle, Information Retrieval is simple. It can be
illustrated by a scene of a store of documents and a person (user of the
store). He formulates a question to which the answer is a set of
documents satisfying his question. He can obtain the set by reading all
the documents in the store, retaining the relevant documents and
discarding all the others. In this scene, it is a 'perfect' retrieval.
But in practice, we need to model the "read" process in both syntactic
and semantic to extract useful information. The target of Information
Retrieval is not only "how to extract useful information", but also "how
to measure relevance among documents". These challenges also exist in
Image Retrieval.

Also the keywords are very dependent on the observer's interest and they
are subjective. Captions are not always precisely describing the
picture. Indexing and searching a large image database via keywords are
time-consuming and inefficient. Content Based Image Retrieval (CBIR)
researches attempt to automate such complex process of retrieving images
that are similar to the reference image or descriptions given.

**2.4 Content Based Image Retrieval**

Content-based image retrieval also known as query by image content and
content-based visual information retrieval problem of searching for
digital images in large database. Content-based means that the search
will analyze the actual contents of image. The term content in this
context might refer to colours, shapes, textures or any other
information that can be derived from the image itself.

The earliest use of the term Content Based Image Retrieval in the
literature seems to be by Kato, was to describe his experiments in
automatic retrieval of images from a database by color and shape
features. The term has since been widely used to describe the process of
retrieving desired images from a large collection on the basis of
features (such as colour,Texture and shape) that can be automatically
extracted from the images themselves. The features used for retrieval
can be either primitive or semantic, but the extraction process must be
predominantly automatic.

The ideal approach of querying an image database is using content
semantics, which applies the human understanding about image.
Unfortunately, extracting the semantic information in an image
efficiently and accurately is still a question. Even with the most
advanced implementation of computer vision, it is still not easy to
identify an image of horses on a road. So, using low level features
instead of semantics is still a more practical way. Until semantic
extraction can be done automatically and accurately, image retrieval
systems cannot be expected to find all correct images. They should
select the most similar images to let the user choose the desired
images. The number of images of retrieved set can be reduced by applying
similarity measure that measures the perceptual similarity.

A typical CBIR system consists of three major components and the
variations of them depend on features used.

i\. **Feature extraction** -- Analyze raw image data to extract feature
specific Information.

ii\. **Feature storage** -- Provide efficient storage for the extracted
information, also help to improve searching speed.

iii\. **Similarity measure** -- Measure the difference between images
for determining the relevance between images.

![](media/image1.emf){width="3.7916666666666665in"
height="2.0416666666666665in"}

Fig 1: CBIR Function

**2.5 Content Based Image Retrieval using colour**

Retrieving image based on color similarity is achieved by computing a
colour histogram for each image that identifies the proportion of pixels
within an images holding specific values. Current research is attempting
to segment colour proportion by region and by spatial relationship among
several colour region.

Among different types of low level features, colour is the most
straightforward information which can be easily retrieved from digital
images with simple and compact description, while others require more
pre-processing and computational tasks such as pattern recognition or
texture analysis.

While comparing image by colour feature, three properties are usually
considered:

i\. **Area of matching** -- Count the area or number of pixels having
same or similar colours. Larger matched area means more similar.

ii\. **Colour distance** -- Distance between colours, usually in a
perceptually uniform color space. Closer between matched colours means
more similar.

iii\. **Spatial distribution** -- Usually used while combining colour
with other features such as texture and shape.

In a typical color similarity measure, area of matching is usually
counted as the similarity colour distance is used to control the
matching between colours and to adjust the similarity. In conventional
colour image retrieval system, the most straight forward approach is
using colour histogram. Histograms of each colour, for example, images
of 256 colours, will be generated. Similarities between such images are
then performed and measured by **Histogram Intersection Method** (HIM).
This is the basic approach and can give simple and efficient
representation of color distribution. Histogram approach is not limited
by taking the number of pixels of each colour in the image or using HIM
similarity measure. Indexes of histograms can represent many types of
features such as colours in different color space, coefficients in
transformed domain or spatial-related information. There are also many
variations in comparing histograms. But histograms have a limitation
that the feature space is fixed, compactness of the description is
limited, because histograms will not skip non -existed colours. One
argument that we can use a lower resolution histogram to improve the
compactness but it is a trade off between compactness and accuracy.

**2.6 JPEG visual descriptors**

That shape often carries semantic information follows from the fact that
many characteristic objects can be visually recognized solely from their
shapes. This distinguishes shape from other elementary visual features
such as color, or texture. But the notion of object shape has many
meanings. To deal with 3D real-world objects, JPEG standard has a 3D
shape descriptor.

JPEG has defined a set of standard descriptors for description and
storage of the most commonly used features. This makes the extracted
features more accessible. Since the required storage size is much
smaller than compressed images files. Moreover, the format of the data
is fixed, so the data can be used in any JPEG compatible systems. Thus
comparison between algorithms can be done easily if the implementations
of the target Algorithms are JPEG compatible.

In JPEG visual standard, some colour descriptors are defined, including
several histogram based descriptors representing different colour
features, and a Dominant Colour Descriptor (DCD). DCD describes colour
feature by a set of representativecolours with their percentage and each
color have at least a certain distance away in CIEcolour space
controlled by a threshold Td. It is very compact since there is no
redundant information for non-existed colours, and similar colours are
grouped into a palette colour.

**2.7Relevance Feedback**

Although JPEG defined efficient and most commonly used CBIR methods,
content based methods still have limitations that they may not be able
to find the images that exactly match user's expectation. One reason is
that a precise query cannot be formulated Although DCD can describe
color features in a compact and effective way, Drawbacks of its default
similarity measure method pull down the performance of DCD.

By just giving an image as query, Interactive searching may be used for
improving the retrieval result by refining the query by user's feedback.
JPEG did not handle interactive searching directly. They use content
management approach to describe multimedia contents in a structural
format. This uses textual semantics. This can improve the efficiency of
browsing and text based searching, but not for content based searching.
Also it is not interactive and the improvement may not show instantly.
For content based interactive searching, Relevance Feedback (RF) is a
commonly used technique which use user selected relevance information to
refine the query.

It can be used as an extension of similarity measure and will not affect
JPEG standard. Since the representations depend on the features,
relevance feedback algorithms may be different for each descriptor. In
this research, a merged palette histogram approach is proposed to
improve Dominant Colour Descriptor searching with use of RF.

But the effect of this coefficient is still not very clear. It is unable
to balance the effect of "area of matching" and "distance between
colours".

It causes ambiguous retrieval results. These problems will be described
in chapter 4, and a new Merged Palette Histogram Similarity Measure
(MPHSM) will be proposed to tackle these problems.

> **3. PROBLEM ANALYSIS**

**3.1 Existing System:**

In earlier days, image retrieving from large image database can be done
by following ways. We will discuss briefly about the image retrieving of
various steps

- Automatic Image Annotation and Retrieval using Cross Media Relevance
  Models

- Concept Based Query Expansion

- Query System Bridging The Semantic Gap For Large Image Databases

- Ontology-Based Query Expansion Widget for information Retrieval

- Detecting image purpose in World-Wide Web documents

**3.2 Proposed System**

Relevance feedback is an interactive process that starts with normal
CBIR. The user input a query, and then the system extracts the image
feature and measure the distance with images in the database. An initial
retrieval list is then generated.

User can choose the relevant image to further refine the query, and this
process can be iterated many times until the user find the desired
images.

> Fig 2 : Block diagram of Proposed System
>
> **4.SYSTEM SOFTWARE REQUIREMENT**

**4.1 Hardware Requirements:**

- Processor : Any processor above 500MHz

- Hard Disk : 500 GB.

- Floppy Drive : 1.44 Mb.

- Monitor : VGA and High Resolution Monitor

- Input device : Standard Keyboard and Mouse

- RAM : 2 GB

**4.2 Software Requirements:**

- Operating system : Windows Family

- Front End : JAVA, Swing

- Tool : NETBEANS IDE 8.1

**4.3 Description of software:**

4.3.1 JAVA ENVIRONMENT

JAVA is a general-purpose computer programming language that is
concurrent, class-based, object-oriented, and specifically designed to
have as few implementation dependencies as possible. It is intended to
let application developers \"write once, run anywhere\" (WORA), meaning
that compiled Java code can run on all platforms that support Java
without the need for recompilation.

Java applications are typically compiled to byte code that can run on
any Java virtual machine (JVM) regardless of computer architecture. Java
is one of the most popular programming languages in use, particularly
for client-server web applications. Java was originally developed by
James Gosling at Sun Microsystems (which has since been acquired by
Oracle Corporation) and released in 1995 as a core component of Sun
Microsystems\' Java platform. The language derives much of its syntax
from C and C++, but it has fewer low-level facilities than either of
them.

We use JAVA for a wide range of applications, including android apps,
Server Apps at Financial Services Industry, Java Web Applications,
Software tools, Trading Application, Big Data Technologies, Scientific
Applications, High Frequency Trading Space.

Programmers have accepted Java very quickly because it provides
everything that is needed in a modern day language including :

- Object - Oriented Features

- Multithreading

- Garbage Collection (Automatic Memory Management)

- Networking and Security Features

- Platform Independence (Architecture Neutral)

- Internet/ Web Development Features

# 4.3.2 ADVANTAGES OF JAVA {#advantages-of-java .unnumbered}

Java has significant advantages over other languages and environments
that make it suitable for just about any programming task.

The advantages of Java are as follows:

- Java is easy to learn.

> Java was designed to be easy to use and is therefore easy to write,
> compile, debug, and learn than other programming languages.

- Java is object-oriented.

> This allows you to create modular programs and reusable code.

- Java is platform-independent.

> One of the most significant advantages of Java is its ability to move
> easily from one computer system to another. The ability to run the
> same program on many different systems is crucial to World Wide Web
> software, and Java succeeds at this by being platform-independent at
> both the source and binary levels.
>
> 4.3.3 PROGRAMMING IN JAVA

# For any java programming we need the JDK because it provides the compiler for compiling Java applets and applications(javac), an interpreter for running standalone Java applications (java), and a debugger (jdbg).  {#for-any-java-programming-we-need-the-jdk-because-it-provides-the-compiler-for-compiling-java-applets-and-applicationsjavac-an-interpreter-for-running-standalone-java-applications-java-and-a-debugger-jdbg.}

All of the tools included in the JDK are designed to support Sun\'s
notion of what the java language is all about including :

- A compiler for the Java language that generates architecture-neutral
  bytecodes.

- The Java Virtual Machine that interprets bytecodes at runtime.

- A set of class libraries to help Java programmers create applications.
  some of these libraries include interface tools, I/O, applet
  development, networking and so on.

- A Java runtime environment that supports bytecode verification,
  multithreading, and garbage collection.

- Java development support tools including a debugger, documentation
  generator, and so on.

# 4.3.4 SWINGS IN JAVA {#swings-in-java .unnumbered}

**Swing** is
a [GUI](https://en.wikipedia.org/wiki/Graphical_user_interface) [widget
toolkit](https://en.wikipedia.org/wiki/Widget_toolkit) for [Java](https://en.wikipedia.org/wiki/Java_(programming_language)).
It is part
of [Oracle](https://en.wikipedia.org/wiki/Oracle_Corporation)\'s [Java
Foundation
Classes](https://en.wikipedia.org/wiki/Java_Foundation_Classes) (JFC) --
an [API](https://en.wikipedia.org/wiki/Application_programming_interface) for
providing a [graphical user
interface](https://en.wikipedia.org/wiki/Graphical_user_interface) (GUI)
for Java programs.

Swing was developed to provide a more sophisticated set of
GUI [components](https://en.wikipedia.org/wiki/Software_component) than
the earlier [Abstract Window Toolkit
(AWT)](https://en.wikipedia.org/wiki/Abstract_Window_Toolkit). Swing
provides a native [look and
feel](https://en.wikipedia.org/wiki/Look_and_feel) that emulates the
look and feel of several platforms, and also supports a [pluggable look
and feel](https://en.wikipedia.org/wiki/Pluggable_look_and_feel) that
allows applications to have a look and feel unrelated to the underlying
platform. It has more powerful and flexible components than AWT. In
addition to familiar components such as buttons, check boxes and labels,
Swing provides several advanced components such as tabbed panel, scroll
panes, trees, tables, and lists.

Unlike AWT components, Swing components are not implemented by
platform-specific code. Instead, they are written entirely in Java and
therefore are platform-independent. The term \"lightweight\" is used to
describe such an element.

Swing is currently in the process of being replaced
by [JavaFX](https://en.wikipedia.org/wiki/JavaFX).

4.3.4.1 SWING FUNCTIONS:

- [**JInternalFrame**](http://www.wideskills.com/java-tutorial/java-jinternalframe-class-example) is
  confined to a visible area of a container it is placed in. It can be
  identified , maximized and layered.

- [**JLabel**](http://www.wideskills.com/java-tutorial/java-jlabel-class-example),
  descended from JComponent, is used to create text labels.

- [**JTextField**](http://www.wideskills.com/java-tutorial/java-jtextfield-class-example) allows
  editing of a single line of text. New features include the ability to
  justify the text left, right, or center, and to set the text's font.

- [**JToolbar** ](http://www.wideskills.com/java-tutorial/java-jtoolbar-class-example)contains
  a number of components whose type is usually some kind of button which
  can also include separators to group related components within the
  toolbar.

> **5.MODEL ARCHITECTURE**

**5.1 Structure of the project:**

> s
>
> Fig 3: Architecture of project
>
> Aim of the proposed algorithm is to develop an algorithm which can be
> easily applied to number of different currencies and has good
> efficiency and high speed. We consider 500,100,50,20,10 rupee of
> Indian Currency.

### Obtaining the Input Image through a scanner or a camera. {#obtaining-the-input-image-through-a-scanner-or-a-camera.}

### Preprocessing Operations makes extraction of features easier. In this particular case, pre processing operations involve gray scale conversion, detecting edges by prewitt filter and Canny's edge detection method. {#preprocessing-operations-makes-extraction-of-features-easier.-in-this-particular-case-pre-processing-operations-involve-gray-scale-conversion-detecting-edges-by-prewitt-filter-and-cannys-edge-detection-method.}

### The features of the image are extracted using Scale Invariant Feature Transform algorithm(SIFT). {#the-features-of-the-image-are-extracted-using-scale-invariant-feature-transform-algorithmsift.}

### Classification of the currencies is by Radial Based Function. {#classification-of-the-currencies-is-by-radial-based-function.}

### Displaying results

###  {#section .unnumbered}

###  {#section-1 .unnumbered}

**5.2 UML Diagrams:**

The UML is a language. It provides vocabulary and the results for
combining words in that vocabulary for the purpose of communication. A
modeling language is language whose vocabulary and rules flows on the
conceptual and physical representation of a system. A modeling language
such as UML is a standard language for software blue prints.

The UML is a language for visualizing, specifying, constructing and
documenting. The software intensive articrafts of a system.

UML diagram are classified into two categories:

1\. Structural or static

2\. Dynamic or behavioral

Structural Model contains

Classes, object, use case, component and deployment.

Behavioral Model contains:

Collaboration, State chart and activity.

Class Diagram

Class diagrams are arguably the most used UML diagram type. It is the
main building block of any object oriented solution. It shows the
classes in a system, attributes and operations of each class and the
relationship between each class.

Component Diagram

A component diagram displays the structural relationship of components
of a software system. These are mostly used when working with complex
systems that have many components. Components communicate with each
other using interfaces.

Deployment Diagram

A deployment diagram shows the hardware of your system and the software
in that hardware.

Use Case Diagram

As the most known diagram type of the behavioral UML diagrams, Use case
diagrams give a graphic overview of the actors involved in a system,
different functions needed by those actors and how these different
functions are interacted.

Activity Diagram

Activity diagrams represent workflows in a graphical way. They can be
used to describe business workflow or the operational workflow of any
component in a system. Sometimes activity diagrams are used as an
alternative to State machine diagrams. 

Sequence Diagram** **

Sequence diagrams in UML show how objects interact with each other and
the order those interactions occur. It's important to note that they
show the interactions for a particular scenario. The processes are
represented vertically and interactions are show as arrows. 

> **5.2.2. Use case Diagram**
>
> ![](media/image2.emf){width="4.88125in" height="6.071527777777778in"}
>
> **5.2.2. Activity diagram:**
>
> yes no
>
> **6.IMPLEMENTATION**

**6.1 Module 1:**

**6.1.1 Pre Processing of image:**

- The task of pre-processing is achieved by converting colored currency
  images into gray scale, which facilitates further pre-processing.

- After that, the edge of the image is filtered using Prewitt method and
  Canny's edge detection method.

A)  RGB TO GRAY SCALE CONVERSION:

RGB Color image:

In RGB color model, each color appears in its primary spectral
components of red, green and blue. The color of a pixel is made up of
three components; red, green , and blue(RGB), described by there
corresponding intensities.

I RGB =(fR ,fG ,fB)

Where fR(x,y) is the intensity of the pixel (x,y) in the red channel,
fG(x,y) is the intensity of pixel (x,y) in the green channel, and
fB(x,y) is the intensity of pixel (x,y) in the blue channel.

Gray Scale image:

>  Gray scale is an image carries only intensity information.
>
> It has range of shades of gray without apparent color. The darkest
> possible shade is black and the lightest possible shade is white. 
>
> Black is represented by R = G = B =00000000, and white is represented
> by R = G = B = 255 or 11111111. Because there are 8 bits in the binary
> representation of the gray level, this imaging method is called 8-bit
> gray scale.

Conversion of RGB Color image to Gray Scale image:

color = (Fr+Fg+Fb)/3

**Iy = 0.299Fr+0.587Fg+0.114F**

[Conversion.java:-]{.underline}

package currency;

importjava.awt.Color;

importjava.awt.image.BufferedImage;

importjava.io.File;

importjava.io.IOException;

importjavax.imageio.ImageIO;

importjavax.swing.ImageIcon;

public class GrayScale {

public static void imageConvert(BufferedImageimg,File f)

{

try{

img = ImageIO.read(f);

int width = img.getWidth();

int height = img.getHeight();

width = img.getWidth();

height = img.getHeight();

int count = 0;

for(int i=0; i\<height; i++){

for(int j=0; j\<width; j++){

count++;

Color c = new Color(img.getRGB(j, i));

> System.out.println(\"S.No: \" + count + \" Red: \" + c.getRed() +\"
> Green: \" + c.getGreen() + \" Blue: \" + c.getBlue());

int red = (int)(c.getRed() \* 0.299);

int green = (int)(c.getGreen() \* 0.587);

int blue = (int)(c.getBlue() \*0.114);

> Color newColor = new
> Color(red+green+blue,red+green+blue,red+green+blue);

img.setRGB(j,i,newColor.getRGB());

}

}

File ouptut = new File(\"e:\\grayscale.jpg\");

ImageIO.write(img, \"jpg\", ouptut);

ImageUtils.oimage = ImageUtils.ConvertToArray(img);

}catch(IOException e){

System.out.println(e);

}

}

}

B)  PREWITT OPERATOR:

Prewitt operator is used for edge detection in an image.

It provides two masks. One for detecting edges in horizontal direction
and the other for detecting edges in vertical direction.

> Vertical direction mask:When this mask is convolved in an image, it
> gives the vertical edges in the image. It simply works like a first
> order derivate and calculates the difference of pixel intensities in
> an edge region.

| -1  | 0   | 1   |
|-----|-----|-----|
| -1  | 0   | 1   |
| -1  | 0   | 1   |

> Horizontal direction mask:When this mask is convolved in an image, it
> gives the horizontal edges in the image. It calculates difference
> among the pixel intensities of a particular edge.

| -1  | -1  | -1  |
|-----|-----|-----|
| 0   | 0   | 0   |
| 1   | 1   | 1   |

[Prewitt.java:]{.underline}

> public class Prewitt2 {
>
> static {
>
> //System.loadLibrary(Core.NATIVE_LIBRARY_NAME);
>
> }

//public static void main(String\[\] args) {

> public static void grayscaleHorizontal(){
>
> try {
>
> intkernelSize = 3;
>
> System.loadLibrary(Core.NATIVE_LIBRARY_NAME );
>
> Mat source = Highgui.imread(\"e:/grayscale.jpg\",
> Highgui.CV_LOAD_IMAGE_GRAYSCALE);
>
> Mat destination = new Mat(source.rows(),source.cols(),source.type());
>
> Mat kernel = new Mat(kernelSize,kernelSize, CvType.CV_32F){
>
> {
>
> put(0,0,-1);
>
> put(0,1,-1);
>
> put(0,2,-1);
>
> put(1,0,0);
>
> put(1,1,0);
>
> put(1,2,0);
>
> put(2,0,1);
>
> put(2,1,1);
>
> put(2,2,1);
>
> }
>
> };
>
> Imgproc.filter2D(source, destination, -1, kernel);
>
> Highgui.imwrite(\"e:/grayscaleh.jpg\", destination);
>
> // InputFrame.jLabel5.setIcon(new ImageIcon(\"e:/grayscaleh.jpg\"));
>
> } catch (Exception e) {
>
> e.printStackTrace();
>
> // System.out.println(\"Error: \" + e.getMessage()); }
>
> }

}

> **6.2 module 2:**

**FEATURE EXTRACTION:**

> One very important area of application is image processing, in which
> algorithms are used to detect and isolate various desired portion or
> shapes of digitized image.
>
> **SCALE INVARIANT FEATURE TRANSFORM** is one of the low level feature
> extraction techniques which we use.
>
> SIFT is used to detect and describe local features in images and can
> help in object recognition. We begin by detecting points of interest,
> which are termed key points. The image is convolved with Gaussian
> filters at different scales and then the difference of successive
> Gaussian- blurred images are taken(DOG).The extraction of these
> features the SIFT algorithm applies a 3 stage filtering approach.
>
> **Scale-Space Extrema Detection**
>
> This stage of the filtering attempts to identify those locations and
> scales that are identifiable from different views of the same object.
> This can be efficiently achieved using a \"scale space\"
> function. Hence this algorithm is scale invariant.

- Difference-of-Gaussian scale-space function, D(x,y,sigma) with key
  point as the origin. This Taylor expansion is given by Taylor series
  which defines D(X).

> **Key point Localization**
>
> This stage attempts to eliminate more points from the list of key
> points by finding those that have low contrast or are poorly localized
> on an edge. If D(X) \<0.03 , then they are considered as the bad
> contrast. Also reject the points of strong edge response.
>
> **Orientation Assignment**
>
> This step aims to assign a consistent orientation to the key points
> based on local image properties. This Remove effects of scale and
> rotation.

[Feature.java:]{.underline}

public class Prewitt2 {

static {

//System.loadLibrary(Core.NATIVE_LIBRARY_NAME);

}

//public static void main(String\[\] args) {

public static void grayscaleHorizontal(){

> try {

intkernelSize = 3;

System.loadLibrary(Core.NATIVE_LIBRARY_NAME );

> Mat source = Highgui.imread(\"e:/grayscale.jpg\",
> Highgui.CV_LOAD_IMAGE_GRAYSCALE);

Mat destination = new Mat(source.rows(),source.cols(),source.type());

Mat kernel = new Mat(kernelSize,kernelSize, CvType.CV_32F){

{

RRED_SIZE)

.addComponent(jLabel4, javax.swing.GroupLayout.PREFERRED_SIZE, 83,
javax.swing.GroupLayout.PREFERRED_SIZE)

.addComponent(jLabel5, javax.swing.GroupLayout.PREFERRED_SIZE, 83,
javax.swing.GroupLayout.PREFERRED_SIZE)

.addComponent(jLabel6, javax.swing.GroupLayout.PREFERRED_SIZE, 83,
javax.swing.GroupLayout.PREFERRED_SIZE)

.addComponent(jLabel7, javax.swing.GroupLayout.PREFERRED_SIZE, 83,
javax.swing.GroupLayout.PREFERRED_SIZE))

.addGap(52, 52, 52)

.addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING,
false)

.addComponent(jTextField2, javax.swing.GroupLayout.DEFAULT_SIZE, 127,
Short.MAX_VALUE)

.addComponent(jTextField3)

.addComponent(jTextField4)

7.Results:

RGB to Gray Scale conversion:

![](media/image3.png){width="6.465277777777778in"
height="3.8333333333333335in"}

Edge detection using Prewitt operator:

![](media/image4.png){width="6.5in" height="3.59375in"}

Input image for testing:

![](media/image5.png){width="6.5in" height="4.104166666666667in"}

Final output:

1\)

![](media/image6.png){width="6.5in" height="3.654166666666667in"}

2\)

![](media/image7.png){width="6.5in" height="4.529166666666667in"}

**8. TESTING**

The purpose of testing is to discover errors. Testing is the process of
trying to discover every conceivable fault or weakness in a work
product. It provides a way to check the functionality of components, sub
assemblies, assemblies and/or a finished product It is the process of
exercising software with the intent of ensuring that the

Software system meets its requirements and user expectations and does
not fail in an unacceptable manner. There are various types of test.
Each test type addresses a specific testing requirement.

#######  {#section-2 .unnumbered}

####### **TYPES OF TESTS** {#types-of-tests .unnumbered}

#######  {#section-3 .unnumbered}

####### **Unit testing** {#unit-testing .unnumbered}

Unit testing involves the design of test cases that validate that the
internal program logic is functioning properly, and that program inputs
produce valid outputs. All decision branches and internal code flow
should be validated. It is the testing of individual software units of
the application .it is done after the completion of an individual unit
before integration. This is a structural testing, that relies on
knowledge of its construction and is invasive. Unit tests perform basic
tests at component level and test a specific business process,
application, and/or system configuration. Unit tests ensure that each
unique path of a business process performs accurately to the documented
specifications and contains clearly defined inputs and expected results.

######## **Integration testing** {#integration-testing .unnumbered}

Integration tests are designed to test integrated software components to
determine if they actually run as one program. Testing is event driven
and is more concerned with the basic outcome of screens or fields.
Integration tests demonstrate that although the components were
individually satisfaction, as shown by successfully unit testing, the
combination of components is correct and consistent. Integration testing
is specifically aimed at exposing the problems that arise from the
combination of components.

####### **Functional test** {#functional-test .unnumbered}

Functional tests provide systematic demonstrations that functions tested
are available as specified by the business and technical requirements,
system documentation, and user manuals.

Functional testing is centered on the following items:

Valid Input : identified classes of valid input must be accepted.

Invalid Input : identified classes of invalid input must be rejected.

Functions : identified functions must be exercised.

Output : identified classes of application outputs must be exercised.

Systems/Procedures: interfacing systems or procedures must be invoked.

Organization and preparation of functional tests is focused on
requirements, key functions, or special test cases. In addition,
systematic coverage pertaining to identify Business process flows; data
fields, predefined processes, and successive processes must be
considered for testing. Before functional testing is complete,
additional tests are identified and the effective value of current tests
is determined.

####### **System Test** {#system-test .unnumbered}

System testing ensures that the entire integrated software system meets
requirements. It tests a configuration to ensure known and predictable
results. An example of system testing is the configuration oriented
system integration test. System testing is based on process descriptions
and flows, emphasizing pre-driven process links and integration points.

####### **White Box Testing** {#white-box-testing .unnumbered}

White Box Testing is a testing in which in which the software tester has
knowledge of the inner workings, structure and language of the software,
or at least its purpose. It is purpose. It is used to test areas that
cannot be reached from a black box level.

####### **Black Box Testing** {#black-box-testing .unnumbered}

Black Box Testing is testing the software without any knowledge of the
inner workings, structure or language of the module being tested. Black
box tests, as most other kinds of tests, must be written from a
definitive source document, such as specification or requirements
document, such as specification or requirements document. It is a
testing in which the software under test is treated, as a black box .you
cannot "see" into it. The test provides inputs and responds to outputs
without considering how the software works.

####### **Black Box Testing** {#black-box-testing-1 .unnumbered}

Black Box Testing is testing the software without any knowledge of the
inner workings, structure or language of the module being tested. Black
box tests, as most other kinds of tests, must be written from a
definitive source document, such as specification or requirements
document, such as specification or requirements document. It is a
testing in which the software under test is treated, as a black box .you
cannot "see" into it. The test provides inputs and responds to outputs
without considering how the software works.

**Test cases:**

| **Sl no** | **Test case**                                 | **Expected Output**     | **Observed Output**     |
|-----------|-----------------------------------------------|-------------------------|-------------------------|
| 1         | Enter 50 rupee note to scan                   | Scanned successfully    | Scanned successfully    |
| 2         | Enter 100 rupee note for recognition          | Doesn't match           | Doesn't match           |
| 3         | Enter 50 rupee note for recognition           | Display matched note    | Display matched note    |
| 4         | Clicking upload button without selecting file | Button is not activated | Button is not activated |

> **9.CONCLUSION**

A new perceptual model based on a set of computational measures
corresponding to perceptual textural features, namely coarseness,
directionality, contrast, and busyness, was introduced in this paper.
Computational measures are based on two different representations
(viewpoints): original images and the autocorrelation function
associated with images. Coarseness was estimated as an average of the
number of extrema. Contrast was estimated as a combination of the
average amplitude of the gradient, the percentage of pixels having the
amplitude superior to a certain threshold and coarseness itself.
Directionality was estimated as the average number of pixels having the
dominant orientation(s). Busyness was estimated based on coarseness. The
computational measures proposed for each perceptual textural feature
were evaluated, based on a psychometric method, by conducting a set of
experimentations taking into account human judgments. The psychometric
method used is based on the sum of rank values and the Spearman
coefficient of rank-correlation. Experimental results show an
appreciable correspondence between the proposed computational measures
and human judgments. Compared to related works, our results are better.
In order to validate the proposed set of computational measures, we
applied them in a content-based image retrieval experimentation using a
large image database, the well-known Brodatz database, which contains
112 classes of 9 images each class for a total of 1008 images. Further
research related to this work concerns mainly possible derivation of
semantically-meaningful features based on the perceptual features used
in this work as well as the use of additional features, such as
randomness, in order eventually to further improve representation and
retrieval effectiveness.

> **10. REFERENCES**

\[1\] N. Abbadeni, "Information retrieval from visual databases using
multiple representations and multiple queries," in *Proc. ACM Symp.
Appl.Comput.*, 2009, pp. 1523--1527.

\[2\] N. Abbadeni, "Perceptual image retrieval," in *Proc. Int. Conf.
Vis. Inf. Syst.*, Amsterdam, Netherlands, 2005, pp. 259--268.

\[3\] N. Abbadeni, "Multiple representations, similarity matching, and
results fusion for content-based image retrieval," *Multimedia Syst.
J.*, vol. 10, no. 5, pp. 444--456, 2005.

\[4\] N. Abbadeni, "Content representation and similarity matching for
texture- based image retrieval," in *Proc. 5th ACM Int. Workshop
Multimedia Inf. Retrieval*, Berkeley, CA, 2003, pp. 63--70.

\[5\] N. Abbadeni, "A new similarity matching measure: Application to
texture- based image retrieval," in *Proc. 3rd Int. Workshop Texture
Anal. Synth.*, Nice, France, 2003, pp. 1--6.

\[6\] N. Abbadeni, D. Ziou, and S. Wang, "Computational measures
corresponding to perceptual textural features," in *Proc. 7th IEEE Int.
Conf. Image Process.*, Vancouver, Canada, 2000, vol. 3, pp. 897--900.

\[7\] N. Abbadeni, D. Ziou, and S.Wang, "Autocovariance-based perceptual
textural features corresponding to human visual perception," in *Proc.
15th IAPR/IEEE Int. Conf. Pattern Recognit.*, Barcelona, Spain, Sep.
3--8, 2000, vol. 3, pp. 901--904.

\[8\] M. Amadasun and R. King, "Textural features corresponding to
textural properties," *IEEE Trans. Syst., Man Cybern.*, vol. 19, no. 5,
pp. 1264--1274, Sep.-Oct. 1989.

\[9\] J. Ashley, R. Barber, M. Flickner, J. Hafner, D. Lee, W. Niblack,
and D. Petkovic, "Automatic and semi-automatic methods for image
annotation and retrieval in QBIC," in *Proc. SPIE Conf. Storage
Retrieval for Image and Video Databases*, 1995, vol. 2420, pp. 24--35.

\[10\] J. R. Bergen and E. H. Adelson, "Early vision and texture
perception," *Nature*, vol. 333, no. 6171, pp. 363--364, May 1988.

\[11\] P. Brodatz*, Textures: A Photographic Album for Artists and
Designers*. New York: Dover, 1966.

\[12\] R. Datta, D. Joshi, J. Li, and J. Z. Wang, "Image retrieval:
Ideas, influences, and trends of the new age," *ACM Trans. Comput.
Surv.*, vol. 40, no. 2, p. 60, 2008.

\[13\] M. Flickner, H. Sawhney, W. Niblack, J. Ashley, Q. Huang, and B.
Dom *et al.*, "Query by image and video content: The QBIC system," *IEEE
Computer*, vol. 28, no. 9, pp. 23--32, Sep. 1995.

\[14\] J. C. French, A. C. Chapin, and W. N. Martin, "An application of
multiple viewpoints to content-based image retrieval," in *Proc.
ACM/IEEE Joint Conf. Digital Libraries*, 2003, pp. 128--130.

\[15\] J. C. Gower, "A general coefficient of similarity and some of its
properties," *Biometrics J.*, vol. 27, pp. 857--874, 1971
