import Accordion, { type AccordionItem } from "./Accordion";

/** FAQ accordion for the calculator page. */
export default function CalcFaq({ items }: { items: AccordionItem[] }) {
  return <Accordion items={items} />;
}
