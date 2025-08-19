import { Category } from "@/app/generated/prisma";

export async function RevalidateSite(
  category: Category | undefined,
  tag: string
) {
  if (!category) {
    return;
  }

  if (Array.isArray(category.sites) && category.sites.length > 0) {
    for (let index = 0; index < category.sites.length; index++) {
      const site = category.sites[index];
      try {
        await fetch(`${site}/api/revalidate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REVALIDATE_TOKEN}`,
          },
          body: JSON.stringify({ tag: tag }),
        });
        return;
      } catch (err) {}
    }
  } else {
    return;
  }
}
