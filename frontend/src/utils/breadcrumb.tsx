import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Link } from '@tanstack/react-router'

type _TBreadcrumbLink = {
  link: string
  children: React.ReactNode | string
}

export function BreadcrumbGenerator({
  elements,
}: {
  elements: Array<_TBreadcrumbLink | string>
}) {
  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          {elements.map((value, index) => (
            <>
              <BreadcrumbItem key={index} className="text-white">
                {typeof value === 'string' ? (
                  value
                ) : (
                  <BreadcrumbLink
                    asChild
                    className="text-white hover:text-white"
                  >
                    <Link to={value.link}>{value.children}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index !== elements.length - 1 && (
                <BreadcrumbSeparator className="text-white" />
              )}
            </>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  )
}
