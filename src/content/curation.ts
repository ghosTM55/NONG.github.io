export interface CurationAnnotation {
  title: string;
  description: string;
}

export interface CurationObject {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  origin: string;
  material: string;
  dimensions: string;
  collection: string;
  accession: string;
  image: `/assets/curation/${string}`;
  alt: string;
  source: string;
  sourceLabel: string;
  license: string;
  ratio: number;
  notes: readonly CurationAnnotation[];
  story: string;
  recordStatus?: "verified" | "demo";
}

const verifiedObjects: readonly CurationObject[] = [
  {
    id: "epsilon-1",
    title: "Aṣṭasāhasrikā Prajñāpāramitā",
    subtitle: "Folio 208, recto",
    date: "11th century",
    origin: "Nalanda, eastern India",
    material: "Pigment and incision on palm leaf",
    dimensions: "Single folio, enlarged capture",
    collection: "Wellcome Collection",
    accession: "MS Sanskrit Epsilon 1",
    image: "/assets/curation/prajnaparamita-folio.webp",
    alt: "Painted palm-leaf folio showing a seated Buddhist figure with two attendants",
    source: "https://commons.wikimedia.org/wiki/File:Folio_208_recto_of_Sanskrit_palm_leaf_manuscript_Wellcome_L0015554.jpg",
    sourceLabel: "Wellcome Collection",
    license: "CC BY 4.0",
    ratio: 1.722,
    notes: [
      {
        title: "Pigment field",
        description: "The red and ochre paint is visibly thinner across the central figure and denser near the outline. Marking this area creates a reference point for comparing pigment loss, abrasion and colour change in later captures.",
      },
      {
        title: "Palm fibre",
        description: "Horizontal fibre bundles remain visible beneath both image and script. Recording their direction helps distinguish the original leaf structure from later cracks, stains or retouching on the surface.",
      },
      {
        title: "Edge loss",
        description: "The lower edge is irregular and exposes individual fibres. A precise annotation records the present outline so future images can be aligned and checked for additional splitting or material loss.",
      },
    ],
    story: "Copied in the orbit of Nalanda, this illustrated folio brings text, image and ritual use onto a single fragile surface. Its Bhujimol script points north toward Nepal, while the manuscript's colophon connects its scribe to one of South Asia's great centres of Buddhist learning. The surviving pigment makes it especially valuable for studying how readers encountered the Perfection of Wisdom as both teaching and image.",
    recordStatus: "verified",
  },
  {
    id: "india-2157",
    title: "Pali Manuscript",
    subtitle: "Carved wooden cover and text block",
    date: "18th century",
    origin: "India",
    material: "Palm leaves and wood",
    dimensions: "54.6 × 9.5 cm",
    collection: "The Metropolitan Museum of Art",
    accession: "89.2.2157",
    image: "/assets/curation/pali-manuscript-india.webp",
    alt: "Two long decorated boards from an Indian Pali palm-leaf manuscript",
    source: "https://www.metmuseum.org/art/collection/search/38030",
    sourceLabel: "The Met Open Access",
    license: "Public Domain",
    ratio: 2.362,
    notes: [
      {
        title: "Carved cover",
        description: "The repeating medallions combine decoration with a protective wooden surface. This annotation isolates the carving so its depth, wear and repeated geometry can be compared across the cover.",
      },
      {
        title: "Script block",
        description: "The text is compressed into a narrow field between decorated terminals. Marking its boundary supports high-resolution transcription and makes line-level comparison possible without handling the manuscript.",
      },
      {
        title: "Binding axis",
        description: "The binding holes establish how the leaves and covers align as one object. Recording this axis helps reconstruct the original assembly and identify leaves that may have shifted or been rebound.",
      },
    ],
    story: "The wooden covers turn this manuscript into a portable reliquary. Carved medallions protect the compact text block while two binding points keep the long leaves aligned. Seen as an assembled object rather than a flat page, it reveals how reading, storage and protection were designed as one system.",
    recordStatus: "verified",
  },
  {
    id: "south-india-123",
    title: "Pali Manuscript",
    subtitle: "Bound manuscript assembly",
    date: "18th century",
    origin: "South India",
    material: "Palm leaves",
    dimensions: "40 × 5.7 cm",
    collection: "The Metropolitan Museum of Art",
    accession: "19.53.123",
    image: "/assets/curation/pali-manuscript-south-india.webp",
    alt: "Open bundle of inscribed palm leaves held by a cord",
    source: "https://www.metmuseum.org/art/collection/search/38029",
    sourceLabel: "The Met Open Access",
    license: "Public Domain",
    ratio: 1.807,
    notes: [
      {
        title: "Cord binding",
        description: "The surviving cord shows how the leaves were secured and opened. Its route and tension points are annotated because they explain local wear around the holes and the movement of the stack.",
      },
      {
        title: "Leaf stack",
        description: "The layered edges reveal differences in thickness, alignment and deformation between leaves. This region is useful for documenting the manuscript as a three-dimensional assembly rather than a single flat image.",
      },
      {
        title: "Incised script",
        description: "The characters were cut into the prepared leaf and darkened for legibility. The annotation identifies a representative writing area for contrast enhancement, transcription and comparison of the scribal hand.",
      },
    ],
    story: "This open bundle preserves the physical rhythm of a palm-leaf book: leaf, hole, cord and cover. The long, narrow format shaped both the script and the reader's movement through the text. Digitising the complete assembly makes those relationships visible without repeatedly handling the original.",
    recordStatus: "verified",
  },
  {
    id: "nepal-124b",
    title: "Cullavagga Fragment",
    subtitle: "Plate VIII, folio 124b",
    date: "9th century",
    origin: "Nepal",
    material: "Ink on palm leaf",
    dimensions: "Four surviving folios",
    collection: "National Archives of Nepal",
    accession: "Folio 124b",
    image: "/assets/curation/pali-manuscript-nepal.webp",
    alt: "Long Pali palm-leaf folio with dense early script in three sections",
    source: "https://commons.wikimedia.org/wiki/File:A_Pali_Manuscript_in_Nepal.jpg",
    sourceLabel: "Wikimedia Commons",
    license: "Public Domain",
    ratio: 5.544,
    notes: [
      {
        title: "Transitional script",
        description: "This writing preserves letterforms between Gupta-derived and later regional scripts. The marked passage gives researchers a stable sample for character comparison and assisted transcription.",
      },
      {
        title: "Folio seam",
        description: "A visible break separates surviving sections of the long folio. Annotating both edges supports virtual joining and records where information may have been lost between fragments.",
      },
      {
        title: "Surface contrast",
        description: "Ink density varies across the photographed leaf. Selecting this region demonstrates where contrast enhancement can recover faint strokes while keeping the unprocessed capture available for reference.",
      },
    ],
    story: "Among the earliest surviving witnesses to the Pali canon, this Nepalese fragment records a transitional script between Gupta-derived forms and later regional hands. Its dense lines and surviving seams make it a strong candidate for script comparison, virtual joining and long-term condition monitoring.",
    recordStatus: "verified",
  },
];

const demoTitles = [
  "Perfection of Wisdom",
  "Lotus Sutra",
  "Jātaka Tales",
  "Medicine Buddha Dhāraṇī",
  "Prajñāpāramitā Commentary",
  "Monastic Discipline",
  "Rāmāyaṇa Episode",
  "Astrological Tables",
  "Healing Formulary",
  "Protective Chants",
  "Temple Chronicle",
  "Grammar Treatise",
  "Ritual Manual",
  "Royal Genealogy",
] as const;

const demoOrigins = ["Nepal", "Odisha, eastern India", "Sri Lanka", "South India", "Myanmar", "Northern Thailand"] as const;
const demoDates = ["c. 1050–1100", "12th century", "14th century", "16th century", "17th century", "18th century"] as const;
const demoMaterials = [
  "Incision and lampblack on palm leaf",
  "Pigment and incision on palm leaf",
  "Ink on prepared palm leaf",
  "Palm leaves, cord and wooden covers",
] as const;

const demoStoryFrames = [
  "The folio sits at the meeting point of recitation and image. Its narrow writing field required the scribe to compress each passage, while the illustrated register gave readers a visual pause within the sequence.",
  "Repeated handling has softened the edges and deepened the colour around the binding holes. Those traces make the object useful for reconstructing how a manuscript moved through study, storage and ceremonial use.",
  "Fine incisions were darkened after writing so that the script remained legible against the leaf. Digital contrast reveals the hand of the scribe, while detailed photography records losses that are difficult to compare by eye.",
  "This record represents one leaf within a larger dispersed manuscript. A shared digital catalogue can reunite related fragments, compare scribal hands and allow specialists in different locations to annotate the same surface.",
  "Pigment, fibre and repair marks occupy different physical layers of the object. Capturing them separately helps conservators distinguish original making from later use and intervention.",
] as const;

const generatedObjects: CurationObject[] = Array.from({ length: 56 }, (_, index) => {
  const source = verifiedObjects[index % verifiedObjects.length];
  const title = demoTitles[index % demoTitles.length];
  const folio = Math.floor(index / demoTitles.length) + 1;
  const objectNumber = index + verifiedObjects.length + 1;
  const origin = demoOrigins[index % demoOrigins.length];
  const date = demoDates[(index * 5) % demoDates.length];
  const storyFrame = demoStoryFrames[index % demoStoryFrames.length];

  return {
    ...source,
    id: `demo-${String(objectNumber).padStart(3, "0")}`,
    title: `${title} · ${String.fromCharCode(64 + folio)}`,
    subtitle: `Sample record, folio ${12 + index * 3} ${index % 2 === 0 ? "recto" : "verso"}`,
    date,
    origin,
    material: demoMaterials[index % demoMaterials.length],
    dimensions: `${28 + (index % 7) * 3}.${index % 9} × ${(4.2 + (index % 5) * 0.6).toFixed(1)} cm`,
    collection: "NONG Studio Digital Heritage Demo Collection",
    accession: `NONG-DEMO-${String(objectNumber).padStart(3, "0")}`,
    notes: [
      {
        title: "Writing field",
        description: "This representative passage is marked for script comparison. A stable annotation keeps transcription, translation and later image captures attached to the same physical area.",
      },
      {
        title: "Binding point",
        description: "The hole or alignment point records how the leaf belonged within a larger manuscript. It is useful for studying assembly, handling wear and the original order of folios.",
      },
      {
        title: "Material trace",
        description: "Visible fibre, abrasion or staining is recorded here as a reference feature. Repeating the same annotation in future photography makes small surface changes easier to identify.",
      },
    ],
    story: `${title} is presented here as a demonstration record from ${origin}, dated to the ${date}. ${storyFrame}`,
    recordStatus: "demo",
  };
});

export const curationObjects: readonly CurationObject[] = [...verifiedObjects, ...generatedObjects];
