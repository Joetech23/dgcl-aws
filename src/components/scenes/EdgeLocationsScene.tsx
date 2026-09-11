'use client'

import type { SceneProps } from './types'
import { SlideFrame } from './SlideFrame'

/**
 * Edge locations. Deck slides 23-25.
 *
 * The narration explains why edges exist. The picture illustrates it: a
 * request from a viewer that would otherwise cross an ocean is served by a
 * nearby edge cache instead.
 */
export function EdgeLocationsScene({ shown, compact }: SceneProps) {
  return (
    <SlideFrame title="Edge Locations" titleAccent="Content close to your users" compact={compact}>
      <div className="mt-2 grid flex-1 grid-cols-[0.95fr_1fr] gap-4">
        <div className="space-y-2 text-[clamp(0.62rem,0.95vw,0.78rem)] leading-snug text-ink/70">
          {shown('intro') ? (
            <p className="anim-rise">
              Points of presence in hundreds of cities. They exist for one reason.
            </p>
          ) : null}
          {shown('physics') ? (
            <p className="anim-rise">
              <strong className="text-blue-deep">Speed of light</strong> is a hard limit.
              London to Sydney takes about a quarter of a second, even in ideal conditions.
            </p>
          ) : null}
          {shown('multiply') ? (
            <p className="anim-rise">
              Multiply that by every image on a busy homepage, and the maths gets ugly.
            </p>
          ) : null}
          {shown('cloudfront') ? (
            <p className="anim-rise rounded-md border-l-[3px] border-gold bg-gold/5 px-3 py-2 text-ink/85">
              Edges <strong className="text-blue-deep">cache your content</strong> close to
              the viewer. AWS calls the service <strong className="text-blue-deep">CloudFront</strong>.
            </p>
          ) : null}
          {shown('trade') ? (
            <p className="anim-rise text-ink/60">
              The trade: you store more copies. Everyone loads faster.
            </p>
          ) : null}
        </div>

        <EdgeMap
          showRegion={shown('intro')}
          showViewer={shown('physics')}
          showEdges={shown('cloudfront')}
        />
      </div>
    </SlideFrame>
  )
}

function EdgeMap({
  showRegion,
  showViewer,
  showEdges,
}: {
  showRegion: boolean
  showViewer: boolean
  showEdges: boolean
}) {
  return (
    <div className="flex items-center justify-center rounded-md border border-line bg-white p-2 shadow-lift">
      <svg viewBox="0 0 320 200" className="h-auto w-full" role="img" aria-label="Viewer, edge and region">
        {/* Ocean */}
        <rect x="0" y="0" width="320" height="200" fill="#F4F6FB" />

        {/* Region (right) */}
        {showRegion ? (
          <g className="anim-rise">
            <rect x="240" y="70" width="70" height="60" rx="6" fill="#000099" />
            <text x="275" y="100" textAnchor="middle" fill="#FFC000" fontSize="10" fontWeight="700">
              REGION
            </text>
            <text x="275" y="115" textAnchor="middle" fill="#FFFFFF" fontSize="8" opacity="0.75">
              Sydney
            </text>
          </g>
        ) : null}

        {/* Viewer (left) */}
        {showViewer ? (
          <g className="anim-rise">
            <circle cx="35" cy="100" r="14" fill="#0000BC" opacity="0.15" />
            <circle cx="35" cy="100" r="8" fill="#0000BC" />
            <text x="35" y="130" textAnchor="middle" fill="#0000BC" fontSize="9" fontWeight="700">
              Viewer
            </text>
            <text x="35" y="142" textAnchor="middle" fill="#0B1020" fontSize="7.5" opacity="0.55">
              London
            </text>
          </g>
        ) : null}

        {/* Slow path with lag warning */}
        {showViewer && !showEdges ? (
          <>
            <path d="M45 100 Q170 40 240 100" stroke="#E5484D" strokeWidth="1.6" strokeDasharray="4 3" className="flow-line" fill="none" />
            <text x="160" y="55" textAnchor="middle" fill="#E5484D" fontSize="8.5" fontWeight="700">
              ~250 ms
            </text>
          </>
        ) : null}

        {/* Edge cache with fast path */}
        {showEdges ? (
          <>
            <g className="anim-rise">
              <rect x="85" y="80" width="46" height="40" rx="6" fill="#F5871F" />
              <text x="108" y="102" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="700">
                EDGE
              </text>
              <text x="108" y="113" textAnchor="middle" fill="#FFFFFF" fontSize="7" opacity="0.85">
                London
              </text>
            </g>
            <path d="M45 100 Q65 100 85 100" stroke="#12B981" strokeWidth="2" fill="none" />
            <text x="65" y="90" textAnchor="middle" fill="#12B981" fontSize="8.5" fontWeight="700">
              &lt; 10 ms
            </text>
            <path d="M131 100 Q200 55 240 100" stroke="#8C99B4" strokeWidth="1" strokeDasharray="3 3" className="flow-line" fill="none" />
            <text x="190" y="60" textAnchor="middle" fill="#8C99B4" fontSize="7" opacity="0.8">
              cache miss only
            </text>
          </>
        ) : null}
      </svg>
    </div>
  )
}
