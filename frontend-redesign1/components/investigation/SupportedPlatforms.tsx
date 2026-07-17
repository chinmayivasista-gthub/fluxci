import {
  GitBranch,
  Workflow,
  Boxes,
  Server,
} from "lucide-react";

const platforms = [
  {
    name: "GitHub Actions",
    icon: GitBranch,
  },
  {
    name: "GitLab CI",
    icon: Workflow,
  },
  {
    name: "Jenkins",
    icon: Boxes,
  },
  {
    name: "CircleCI",
    icon: Server,
  },
];

export default function SupportedPlatforms() {
  return (
    <section className="mt-2">

      <p className="label mb-7">
        Supported Platforms
      </p>

      <div className="flex flex-wrap gap-3">

        {platforms.map((platform) => {

          const Icon = platform.icon;

          return (

            <div
              key={platform.name}
              className="
                inline-flex
                items-center
                gap-2.5
                whitespace-nowrap
                rounded-xl
                border
                border-zinc-700
                bg-[#111827]
                px-4
                py-2.5
                text-sm
                font-medium
                transition-all
                hover:border-blue-500
                hover:bg-[#172033]
              "
            >

              <Icon
                size={15}
                className="shrink-0 text-blue-400"
              />

              <span className="leading-none">
                {platform.name}
              </span>

            </div>

          );

        })}

      </div>

    </section>
  );
}