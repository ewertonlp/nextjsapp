import { useRef } from 'react'
// next
import NextLink from 'next/link'
// @mui
import { Box, Link } from '@mui/material'
import { useTheme } from '@mui/material/styles'
// @types
import { MenuCarouselProps } from './types'
//
import Carousel, { CarouselArrows, CarouselDots } from '../carousel'
import Image from '../image/Image'
import TextMaxLine from '../text-max-line'

// ----------------------------------------------------------------------

export default function MenuCarousel({ products, numberShow, sx }: MenuCarouselProps) {
    const theme = useTheme()
    const carouselRef = useRef<Carousel | null>(null)

    const carouselSettings = {
        dots: true,
        arrows: false,
        slidesToShow: numberShow,
        slidesToScroll: numberShow,
        rtl: Boolean(theme.direction === 'rtl'),
        ...CarouselDots(),
    }

    const handlePrev = () => {
        carouselRef.current?.slickPrev()
    }

    const handleNext = () => {
        carouselRef.current?.slickNext()
    }

    return (
        <Box sx={{ position: 'relative', ...sx }}>
            <CarouselArrows
                filled
                onNext={handleNext}
                onPrevious={handlePrev}
                leftButtonProps={{
                    size: 'small',
                    sx: { top: 56, left: -8 },
                }}
                rightButtonProps={{
                    size: 'small',
                    sx: { top: 56, right: -8 },
                }}
            >
                <Carousel ref={carouselRef} {...carouselSettings}>
                    {products.map(product => (
                        <Box key={product.name} sx={{ px: 1, textAlign: 'center' }}>
                            <NextLink href={product.path} passHref>
                                <Link
                                    color="inherit"
                                    underline="none"
                                    sx={{
                                        display: 'block',
                                        transition: theme => theme.transitions.create('all'),
                                        '&:hover': { color: 'primary.main' },
                                    }}
                                >
                                    <Image
                                        alt={product.image}
                                        src={product.image}
                                        ratio="1/1"
                                        disabledEffect
                                        sx={{ borderRadius: 1, mb: 1 }}
                                    />

                                    <TextMaxLine line={2} variant="caption" sx={{ fontWeight: 'fontWeightMedium' }}>
                                        {product.name}
                                    </TextMaxLine>
                                </Link>
                            </NextLink>
                        </Box>
                    ))}
                </Carousel>
            </CarouselArrows>
        </Box>
    )
}
